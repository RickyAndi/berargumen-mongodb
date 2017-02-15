new Vue({
	el: '#board-panel',
	data : {
		boards : [],
		userId : null,
		currentPage : 1,
		numberOfPages : 0,
		loadings : {
			getBoards : true
		}
	},
	methods : {
		getBoards : function(page) {
			
			var vm = this;
			
			vm.loadings.getBoards = true;

			var url = '/api/user/' + this.userId + '/boards';
			var request = $.get({
				url : url,
				data : {
					page : page == null ? 1 : page
				}
			})

			return request
				.then(function(boards) {
					vm.boards.splice(0, vm.boards.length)

					vm.numberOfPages = boards.pages;

					boards.docs.forEach(function(board) {
						
						var updatedDate = moment(board.updated).format('D-MM-YYYY');
						
						var toBePushedboard  = new Board();
						toBePushedboard
							.setId(board._id)
							.setTitle(board.title)
							.setDescription(board.description)
							.setUpdatedDate(updatedDate)
							.setTags(board.tags);

						vm.boards.push(toBePushedboard);
					})

					vm.loadings.getBoards = false;
				})
				.catch(function(errro) {
					
					if(error.status == 0) {
						vm.notifyThatSomethingError('Kelihatannya koneksi internet anda putus.');
					}

					vm.notifyThatSomethingError('Kelihatannya server kami mengalami masalah.');

					vm.loadings.getBoards = false;
				})
		},
		displayPaginationButton : function(currentPage, page) {
			return (currentPage - 2) > page || (currentPage + 2) < page  
		},
		boardsGoToPage : function(page) {
			this.currentPage = page;
			this.getBoards(page);
		},
		viewBoard : function(boardId) {
			var url = '/board/' + boardId;
			window.open(url);
		},
		viewBoardByTag : function(tag) {
			var url = '/tag/board?tag=' + tag;
			window.open(url);
		},
		notifyThatSomethingError : function(message) {
			toasts.error(message)
		}
	},
	mounted : function() {
		this.userId = $('meta[name=userId]').attr("content");
		
		this.getBoards();
	}

})