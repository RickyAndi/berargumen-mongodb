new Vue({
	el : '#app',
	data : {
		forms : {
			createBoard : {
				title : '',
				description : ''
			}
		},
		modals : {
			createBoardModal : null
		},
		boards : []
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

			var request = $.post({
				url : '/api/my-board',
				data : JSON.stringify(vm.forms.createBoard),
				contentType : 'application/json; charset=UTF-8',
			});

			request
				.then(function(newBoard) {
					
					var board  = new Board();
					board
						.setId(newBoard._id)
						.setTitle(newBoard.title)
						.setDescription(newBoard.description);

					vm.boards.push(board);
					
					vm.hideCreateBoardModal();
				})
				.catch(function(error) {
					console.log(error)
				})
		},
		getBoards : function() {
			var vm = this;

			var request = $.get({
				url : '/api/my-boards',
			});

			request
				.then(function(boards) {
					boards.docs.forEach(function(board) {
						
						var toBePushedboard  = new Board();
						toBePushedboard
								.setId(board._id)
								.setTitle(board.title)
								.setDescription(board.description);
								
						vm.boards.push(toBePushedboard);
					})
				})
				.catch(function(error) {
					console.log(error)
				})
		},
		viewBoard : function(boardId) {
			var url = '/board/' + boardId;
			window.open(url);
		}
	},
	mounted : function() {
		this.modals.createBoardModal = $('#createBoardModal');

		this.getBoards();
	}
})