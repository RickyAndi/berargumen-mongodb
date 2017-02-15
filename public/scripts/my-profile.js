new Vue({
	el : '#app',
	data : {
		forms : {
			createBoard : {
				title : '',
				description : '',
				tags : '',
				status : 'create-board'
			}
		},
		loadings : {
			submitBoards : false,
			getBoards : true
		},
		toBe : {
			indexBoardEdited : null
		},
		inputs : {
			tags : null
		},
		numberOfPages : 0,
		currentPage : 1,
		modals : {
			createBoardModal : null
		},
		boards : [],
		formsError : {
			createBoard : {
				title : {
					error : false,
					message : ''
				},
				description : {
					error : false,
					message : ''
				},
				tags : {
					error : false,
					message : ''
				}
			}
		}
	},
	methods : {
		openCreateBoardModal : function() {
			this.modals.createBoardModal.modal({
				backdrop: 'static',
				keyboard: false
			})
		},
		hideCreateBoardModal : function() {
			this.modals.createBoardModal.modal('hide')
		},
		createBoard : function() {
			
			var vm = this;

			vm.forms.createBoard.tags = vm.inputs.tags.val();

			var request = $.post({
				url : '/api/board',
				data : JSON.stringify(vm.forms.createBoard),
				contentType : 'application/json; charset=UTF-8',
			});

			request
				.then(function(newBoard) {
					vm.getBoards(vm.currentPage).then(function() {
						vm.loadings.submitBoards = false;
						vm.hideCreateBoardModal();
						vm.notifyThatSomethingSuccess('Board Berhasil Tersimpan');
					});
				})
				.catch(function(error) {
					vm.loadings.submitBoards = false;

					vm.handleError(error, function(error) {
						if(error.status == 400) {
							var error = JSON.parse(error.responseText);
							vm.handleValidationErrors(error.errors);
						}
					})
				})
		},
		editBoard : function() {

			var vm = this;

			vm.loadings.submitBoards = true;
			
			var boardIdToBeEdited = this.boards[this.toBe.indexBoardEdited].getId();
			var url = '/api/board/' + boardIdToBeEdited + '/update';

			vm.forms.createBoard.tags = vm.inputs.tags.val();

			var request = $.post({
				url : url,
				data : JSON.stringify(vm.forms.createBoard),
				contentType : 'application/json; charset=UTF-8',
			});

			return request
				.then(function() {
					vm.getBoards(vm.currentPage).then(function() {
						vm.loadings.submitBoards = false;
						vm.hideCreateBoardModal();
						vm.notifyThatSomethingSuccess('Board berhasil diubah');
					});
				})
				.catch(function(error) {
					
					vm.loadings.submitBoards = false;

					vm.handleError(error, function(error) {
						if(error.status == 400) {
							var error = JSON.parse(error.responseText);
							vm.handleValidationErrors(error.errors);
						}
					})
				})

		},
		getBoards : function(page) {
			var vm = this;

			vm.loadings.getBoards = true;

			var request = $.get({
				url : '/api/my-boards',
				data: { 
				   page: page == null ? 1 : page, 
				},
			});

			return request
				.then(function(boards) {

					vm.boards.splice(0, vm.boards.length)
					vm.numberOfPages = boards.pages;

					boards.docs.forEach(function(board) {
						
						var toBePushedboard  = new Board();
						
						toBePushedboard
							.setId(board._id)
							.setTitle(board.title)
							.setDescription(board.description)
							.setTags(board.tags);

						vm.boards.push(toBePushedboard);
					})

					vm.loadings.getBoards = false;
				})
				.catch(function(error) {
					
					vm.loadings.getBoards = false;
				})
		},
		viewBoard : function(boardId) {
			var url = '/board/' + boardId;
			window.open(url);
		},
		boardsGoToPage : function(page) {
			this.currentPage = page;
			this.getBoards(page);
		},
		displayPaginationButton : function(currentPage, page) {
			return (currentPage - 2) > page || (currentPage + 2) < page  
		},
		openModalToCreateBoard :function() {
			this.forms.createBoard.status = 'create-board';
			this.openCreateBoardModal();
		},
		openModalToEditBoard : function(index) {
			
			var vm = this;

			this.forms.createBoard.status = 'edit-board';
			this.toBe.indexBoardEdited = index;

			this.boards[index].getTags().forEach(function(tag) {
				vm.inputs.tags.tagsinput('add', tag);
			});

			vm.forms.createBoard.title = vm.boards[index].getTitle();
			vm.forms.createBoard.description = vm.boards[index].getDescription();

			vm.openCreateBoardModal();
		},
		viewBoardByTag : function(tag) {
			var url = '/tag/board?tag=' + tag;
			window.open(url);
		},
		handleValidationErrors : function(errors) {
			
			var vm = this;

			var params = ['title', 'description', 'tags'];

			params.forEach(function(param) {
				var paramError = errors.find(function(error) {
					return error.param == param
				})

				if(paramError != undefined) {

					vm.formsError.createBoard[param].error = true;
					vm.formsError.createBoard[param].message  = paramError.msg
				}
			})
		},
		resetFormErrorState : function(param) {
			this.formsError.createBoard[param].error = false;
		},
		resetAllFormErrorState : function() {
			var vm = this;

			var params = ['title', 'description', 'tags'];

			params.forEach(function(param) {
				vm.resetFormErrorState(param);
			})
		},
		notifyThatSomethingError : function(message) {
			toastr.error(message);
		},
		notifyThatSomethingSuccess : function(message) {
			toastr.success(message);
		},
		handleError : function(error, callback) {
			var vm = this;
			if(error.status == 0) {
				vm.notifyThatSomethingError('Kelihataanya koneksi internet anda bermasalah');
				if(typeof callback == 'function') {
					callback.bind(vm)(error);
				}
			}

			if(error.status == 401) {
				if(typeof callback == 'function') {
					callback.bind(vm)(error);
				}
			}

			if(error.status == 400) {
				vm.notifyThatSomethingError('Mohon perbaiki isian form sesuai dengan pesan yang ada');
				if(typeof callback == 'function') {
					callback.bind(vm)(error);
				}
			}
		},
	},
	mounted : function() {
		
		var vm = this;

		toastr.options = {
		  "closeButton": false,
		  "debug": false,
		  "newestOnTop": false,
		  "progressBar": true,
		  "positionClass": "toast-top-right",
		  "preventDuplicates": true,
		  "onclick": null,
		  "showDuration": "300",
		  "hideDuration": "1000",
		  "timeOut": "5000",
		  "extendedTimeOut": "1000",
		  "showEasing": "swing",
		  "hideEasing": "linear",
		  "showMethod": "fadeIn",
		  "hideMethod": "fadeOut"
		}

		vm.inputs.tags =  $('#tagsinput');
		
		vm.inputs.tags.tagsinput({
			tagClass : 'btn btn-default btn-xs button-tags'
		});

		vm.inputs.tags.on('beforeItemAdd', function(event) {
			vm.resetFormErrorState('tags')
		});

		vm.modals.createBoardModal = $('#createBoardModal');
		
		vm.modals.createBoardModal.on('hidden.bs.modal', function() {
			vm.forms.createBoard.title = '';
			vm.forms.createBoard.description = '';
			vm.inputs.tags.tagsinput('removeAll');

			vm.resetAllFormErrorState();
		})

		vm.getBoards();
	}
})