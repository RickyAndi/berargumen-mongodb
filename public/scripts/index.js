new Vue({
	el : '#app',
	data : {
		boards : {
			currentUser : [],
			all : [],
			bookmarked : [],
			collaborated : [],
		},
		loadings : {
			allBoardsSearch : false,
			currentUserBoardsSearch : false,
			bookmarkedBoardsSearch : false,
			collaboratedBoardsSearch : false,
			submitBoards : false
		},
		textQueries : {
			allBoards : '',
			currentUserBoards : '',
			bookmarkedBoards : '',
			collaboratedBoards : '',
		},
		toBe : {
			boardIndexEdited : null
		},
		boardSearchSubscribtions : {
			all : null,
			currentUser : null,
			bookmarked : null,
			collaborated : null
		},
		boardSearchSubjects : {
			all : new Rx.Subject(),
			currentUser : new Rx.Subject(),
			bookmarked : new Rx.Subject(),
			collaborated : new Rx.Subject()
		},
		currentUser : null,

		modals : {
			createBoardModal : null
		},
		forms : {
			createBoard : {
				title : null,
				description : null,
				tags : null,
				status : 'create-board'
			}
		},
		inputs : {
			tags : null
		},
		numberOfPages : {
			allBoards : 0,
			currentUserBoards : 0,
			bookmarkedBoards : 0,
			collaboratedBoards : 0
		},
		currentPage : {
			allBoards : 1,
			currentUserBoards : 1,
			bookmarkedBoards : 1,
			collaboratedBoards : 1
		},
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
		getCurrentUser : function() {
			
			var vm = this;
			
			var request = $.get({
				url : '/api/me',
			});

			return request
				.then(function(user) {
					
					vm.currentUser = new User();
					vm.currentUser
						.setId(user._id)
						.setName(user.name)
						.setPhotoUrl(user.profilePicUrl)

					return user;	
				})
				.catch(function(error) {
					
				})
		},
		getCurrentUserBoards : function(page) {
			var vm = this;

			var request = $.get({
				url : '/api/my-boards',
				data: { 
				   page: page == null ? 1 : page,
				   q : vm.textQueries.currentUserBoards
				},
			});

			return request
				.then(function(currentUserBoards) {
					
					vm.boards.currentUser.splice(0, vm.boards.currentUser.length)

					vm.numberOfPages.currentUserBoards= currentUserBoards.pages;

					currentUserBoards.docs.forEach(function(board) {
						
						var updatedDate = moment(board.updated).format('D-MM-YYYY');
						
						var toBePushedboard  = new Board();
						
						toBePushedboard
							.setId(board._id)
							.setTitle(board.title)
							.setDescription(board.description)
							.setUpdatedDate(updatedDate)
							.setTags(board.tags);

						vm.boards.currentUser.push(toBePushedboard);
					})
				})
				.catch(function(error) {
					vm.handleError(error);
				})
		},
		getAllBoards : function(page) {
			var vm = this;

			var request = $.get({
				url : '/api/boards',
				data: { 
				   page: page == null ? 1 : page,
				   q : vm.textQueries.allBoards
				},
			});

			return request
				.then(function(allBoards) {
					
					vm.boards.all.splice(0, vm.boards.all.length)

					vm.numberOfPages.allBoards = allBoards.pages;

					allBoards.docs.forEach(function(board) {
						var user = new User();
						
						user
							.setId(board.user.id)
							.setName(board.user.name)
						
						var updatedDate = moment(board.updated).format('D-MM-YYYY');
						var toBePushedboard  = new Board();
						
						toBePushedboard
							.setId(board._id)
							.setTitle(board.title)
							.setDescription(board.description)
							.setUser(user)
							.setUpdatedDate(updatedDate)
							.setTags(board.tags);

						vm.boards.all.push(toBePushedboard);
					})
				})
				.catch(function(error) {
					vm.handleError(error);
				})
		},
		editBoard : function() {
			
			var vm = this;

			vm.loadings.submitBoards = true;

			var boardIdToBeEdited = this.boards.currentUser[this.toBe.boardIndexEdited].getId();
			var url = '/api/board/' + boardIdToBeEdited + '/update';

			vm.forms.createBoard.tags = vm.inputs.tags.val();

			var request = $.post({
				url : url,
				data : JSON.stringify(vm.forms.createBoard),
				contentType : 'application/json; charset=UTF-8',
			});

			return request
				.then(function() {
					vm.loadings.submitBoards = false;
					vm.getCurrentUserBoards(vm.currentPage.currentUserBoards);
					vm.hideCreateBoardModal();
					vm.notifyThatSomethingSuccess('Board berhasil diubah');
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
		getBookmarkedBoards : function(page) {
			var vm = this;

			var request = $.get({
				url : '/api/bookmarked-boards',
				data: { 
				   page: page == null ? 1 : page,
				   q : vm.textQueries.bookmarkedBoards 
				},
			});

			return request
				.then(function(bookmarkedBoards) {
					
					vm.boards.bookmarked.splice(0, vm.boards.bookmarked.length)

					vm.numberOfPages.bookmarkedBoards= bookmarkedBoards.pages;

					bookmarkedBoards.docs.forEach(function(board) {
						var user = new User();
						
						user
							.setId(board.user.id)
							.setName(board.user.name)
						
						var updatedDate = moment(board.updated).format('D-MM-YYYY');
						
						var toBePushedboard  = new Board();
						toBePushedboard
							.setId(board._id)
							.setTitle(board.title)
							.setDescription(board.description)
							.setUser(user)
							.setUpdatedDate(updatedDate)
							.setTags(board.tags);

						vm.boards.bookmarked.push(toBePushedboard);
					})
				})
				.catch(function(error) {
					vm.handleError(error);
				})
		},
		getCollaboratedBoards : function(page) {
			var vm = this;

			var request = $.get({
				url : '/api/collaborated-boards',
				data: { 
				   page: page == null ? 1 : page,
				   q : vm.textQueries.collaboratedBoards
				},
			});

			return request
				.then(function(collaboratedBoards) {
					
					vm.boards.collaborated.splice(0, vm.boards.collaborated.length)

					vm.numberOfPages.collaboratedBoards = collaboratedBoards.pages;

					collaboratedBoards.docs.forEach(function(board) {
						
						var user = new User();
						
						user
							.setId(board.user.id)
							.setName(board.user.name)
						
						var updatedDate = moment(board.updated).format('D-MM-YYYY');
						var toBePushedboard  = new Board();
						toBePushedboard
							.setId(board._id)
							.setTitle(board.title)
							.setDescription(board.description)
							.setUser(user)
							.setUpdatedDate(updatedDate)
							.setTags(board.tags);

						vm.boards.collaborated.push(toBePushedboard);
					})
				})
				.catch(function(error) {
					vm.handleError(error);
				})
		},
		openCreateBoardModal : function() {
			this.modals.createBoardModal.modal({
				backdrop: 'static',
				keyboard: false
			})
		},
		openModalToCreateBoard : function() {
			this.forms.createBoard.status = 'create-board';
			this.openCreateBoardModal();
		},
		hideCreateBoardModal : function() {
			this.modals.createBoardModal.modal('hide')
		},
		createBoard : function() {
		
			var vm = this;

			vm.loadings.submitBoards = true;

			vm.forms.createBoard.tags = vm.inputs.tags.val();

			var request = $.post({
				url : '/api/board',
				data : JSON.stringify(vm.forms.createBoard),
				contentType : 'application/json; charset=UTF-8',
			});

			request
				.then(function(newBoard) {
					vm.loadings.submitBoards = false;
					
					vm.getCurrentUserBoards(vm.currentPage.currentUserBoards);
					
					vm.hideCreateBoardModal();
					vm.notifyThatSomethingSuccess('Board Berhasil Tersimpan');
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
		viewBoard : function(boardId) {
			var url = '/board/' + boardId;
			window.open(url);
		},
		currentUserBoardsGoToPage : function(page) {
			this.currentPage.currentUserBoards = page;
			this.getCurrentUserBoards(page);
		},
		allBoardsGoToPage : function(page) {
			this.currentPage.allBoards = page;
			this.getAllBoards(page);
		},
		bookmarkedBoardsGoToPage : function(page) {
			this.currentPage.bookmarkedBoards = page;
			this.getBookmarkedBoards(page);
		},
		collaboratedBoardsGoToPage : function(page) {
			this.currentPage.collaboratedBoards = page;
			this.getCollaboratedBoards(page);
		},
		displayPaginationButton : function(currentPage, page) {
			return (currentPage - 2) > page || (currentPage + 2) < page  
		},
		viewUserProfile : function(userId) {
			window.open('/profile/' + userId);
		},
		openModalToEditBoard : function(index) {
			var vm = this;
			
			vm.forms.createBoard.status = 'edit-board';
			vm.toBe.boardIndexEdited = index;
			
			vm.boards.currentUser[index].getTags().forEach(function(tag) {
				vm.inputs.tags.tagsinput('add', tag);						
			})
			vm.forms.createBoard.title = vm.boards.currentUser[index].getTitle();
			vm.forms.createBoard.description = vm.boards.currentUser[index].getDescription();

			vm.openCreateBoardModal();
		},
		viewBoardByTag : function(tag) {
			var url = '/tag/board?tag=' + tag;
			window.open(url);
		},
		searchAllBoards : function(event) {
			this.currentPage.allBoards = 1;
			this.loadings.allBoardsSearch = true;
			this.textQueries.allBoards = event.target.value;
			this.boardSearchSubjects.all.onNext(event.target.value);
		},
		searchCurrentUserBoards : function(event) {
			if(this.currentUser != null) {
				this.currentPage.currentUserBoards = 1;
				this.loadings.currentUserBoardsSearch = true;
				this.textQueries.currentUserBoards = event.target.value;
				this.boardSearchSubjects.currentUser.onNext(event.target.value);
			}
		},
		searchBookmarkedBoards : function(event) {
			if(this.currentUser != null) {
				this.currentPage.bookmarkedBoards = 1;
				this.loadings.bookmarkedBoardsSearch = true;
				this.textQueries.bookmarkedBoards = event.target.value;
				this.boardSearchSubjects.bookmarked.onNext(event.target.value);
			}
		},
		searchCollaboratedBoards : function(event) {
			if(this.currentUser != null) {
				this.currentPage.collaboratedBoards = 1;
				this.loadings.collaboratedBoardsSearch = true;
				this.textQueries.collaboratedBoards = event.target.value;
				this.boardSearchSubjects.collaborated.onNext(event.target.value);
			}
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
		}
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
			
		vm.modals.createBoardModal = $('#create-board-modal');
		vm.modals.createBoardModal.on('hidden.bs.modal', function() {
			vm.forms.createBoard.title = '';
			vm.forms.createBoard.description = '';
			vm.inputs.tags.tagsinput('removeAll');

			vm.resetAllFormErrorState();
		})
		
		vm.getCurrentUser()
			.then(function(data) {
				vm.getCurrentUserBoards();
				vm.getCollaboratedBoards();
				vm.getBookmarkedBoards();
			})

		vm.getAllBoards();

		vm.boardSearchSubscribtions.all = vm.boardSearchSubjects.all
			.debounce(250)
			.distinctUntilChanged()
			.subscribe(function() {
				
				vm.getAllBoards(vm.currentPage.allBoards)
					.then(function() {
						vm.loadings.allBoardsSearch = false;
					})
					.catch(function() {
						vm.loadings.allBoardsSearch = false;
						vm.notifyThatSomethingError('Kelihataanya Koneksi Anda Bermasalah');
					})
			});

		vm.boardSearchSubscribtions.currentUser = vm.boardSearchSubjects.currentUser
			.debounce(250)
			.distinctUntilChanged()
			.subscribe(function() {
				
				vm.getCurrentUserBoards(vm.currentPage.currentUserBoards)
					.then(function() {
						vm.loadings.currentUserBoardsSearch = false;
					})
					.catch(function() {
						vm.loadings.currentUserBoardsSearch = false;
						vm.notifyThatSomethingError('Kelihataanya Koneksi Anda Bermasalah');
					})
			});

		vm.boardSearchSubscribtions.bookmarked = vm.boardSearchSubjects.bookmarked
			.debounce(250)
			.distinctUntilChanged()
			.subscribe(function() {
				
				vm.getBookmarkedBoards(vm.currentPage.bookmarkedBoards)
					.then(function() {
						vm.loadings.bookmarkedBoardsSearch = false;
					})
					.catch(function() {
						vm.loadings.bookmarkedBoardsSearch = false;
						vm.notifyThatSomethingError('Kelihataanya Koneksi Anda Bermasalah');
					})
			});

		vm.boardSearchSubscribtions.collaborated = vm.boardSearchSubjects.collaborated
			.debounce(250)
			.distinctUntilChanged()
			.subscribe(function() {
				
				vm.getCollaboratedBoards(vm.currentPage.collaboratedBoards)
					.then(function() {
						vm.loadings.collaboratedBoardsSearch = false;
					})
					.catch(function() {
						vm.loadings.collaboratedBoardsSearch = false;
						vm.notifyThatSomethingError('Kelihataanya Koneksi Anda Bermasalah');
					})
			});

	}
})