new Vue({
	el: '#board-panel',
	data : {
		boards : [],
		userId : null,
		currentPage : 1,
		numberOfPages : 0,
		tag : null
	},
	methods : {
		getBoards : function(page) {
			
			var vm = this;
			
			var url = '/api/tag/boards';
			
			var request = $.get({
				url : url,
				data : {
					page : page == null ? 1 : page,
					tag : vm.tag
				}
			})

			return request
				.then(function(boards) {
					
					vm.boards.splice(0, vm.boards.length)

					vm.numberOfPages = boards.pages;

					boards.docs.forEach(function(board) {
						
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

						vm.boards.push(toBePushedboard);
					})
				})
				.catch(function() {

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
		viewUserProfile : function(userId) {
			window.open('/profile/' + userId);
		},
	},
	mounted : function() {
		this.tag = $('meta[name=tag]').attr('content');
		
		this.getBoards();
	}
})