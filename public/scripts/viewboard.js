new Vue({
	el: '#app',
	data : {
		user : new User(),
		board : new Board(),
		cards : [],
		connections : [],
		collaboratorsRequest : [],
		boardCollaborators : [],
		formStatus : 'create-contention',
		modals : {
			createCard : null,
			deleteCardConfirmation : null,
			collaborator : null
		},
		forms : {
			createCard : {
				title : null
			}
		},
		editor : null,
		tobe : {
			relatedId : null,
			deletedCardIndex : 0,
			sendCardType : 'contention',
			changedCardIndex : 0,
			rejectedCollaboratorRequestIndex : null,
			acceptedCollaboratorRequestIndex : null,
		},
		sockets : {
			card : null
		},
		loadings : {
			cardSubmit : false,
			requestToBeCollaborator : false,
			cardDelete : false,
			bookmarkRequest : false,
			acceptJoin : false,
			rejectJoin : false,
		},
		formsError : {
			createCard : {
				title : {
					error : false,
					message : ''
				}
			}
		},
		scale : 1,
		leftSubtractValue : 0,
		topSubtractValue : 0,
		isUserBookmarkedThisBoard : false,
		isUserCollaborator : false,
		isUserInRequestingToBeCollaborator : false,
		isUserLoggedIn : false,
		isUserOwnerOfBoard : false,
		isUserCollaboratorRequestRejected : false,
		boardInitialization : true
	},
	components : {
		'draggable-card' : draggableCardComponent
	},
	methods : {
		getUser : function() {
			
			var vm = this;

			var url = '/api/me';

			var request = $.get({
				url :url
			})

			return request.then(function(user) {
				vm.user
					.setId(user._id)
					.setName(user.name)
			});
		},
		getBoardData : function() {
			
			// set collaboratorIds

			var vm = this;

			var boardId = $('meta[name=boardId]').attr("content");
			var url = '/api/board/' + boardId;

			var request = $.get({
				url : url
			})

			return request
				.then(function(board) {

					var collaboratorIds = board.collaborators.map(function(collaborator) {
						return collaborator.userId;
					})

					var boardCreator = new User();

					boardCreator
						.setName(board.user.name)
						.setId(board.user.id);

					vm.board
						.setId(board._id)
						.setCollaboratorIds(collaboratorIds)
						.setUser(boardCreator);
				
				})
				.catch(function(error) {
					vm.notifyThatSomethingError('Gagal mendapat data');
				})
		},
		getCards : function() {
			var vm = this;

			var boardId = $('meta[name=boardId]').attr("content");
			var url = '/api/board/' + boardId + '/cards';

			var request = $.get({
				url : url
			})

			return request
				.then(function(cards) {
					cards.forEach(function(card) {
						
						var cardInstance = new Card();
						
						var creatorOfCard = new User();
						creatorOfCard
							.setId(card.creator.id)
							.setName(card.creator.name)

						var cardRelation = new Relation();
							cardRelation
								.setTo(card.related.to)
								.setType(card.related.type);

						cardInstance
							.setId(card._id)
							.setTitle(card.title)
							.setContent(card.content)
							.setType(card.type)
							.setCreator(creatorOfCard)
							.setLeft(card.left)
							.setTop(card.top)
							.setRelation(cardRelation);

						vm.cards.push(cardInstance);
					})
				})
				.catch(function(error) {
					vm.notifyThatSomethingError('Gagal mendapat data');
				})
		},
		getViewBoardPageData : function() {

			var vm = this;

			var boardId = $('meta[name=boardId]').attr("content");

			var url = '/api/page-data/view-board';

			var request = $.get({
				url : url,
				data : {
					boardId : boardId
				}
			});

			return request
				.then(function(data) {
					
					// set boardId
					vm.board.setId(data.boardId);

					// set User
					if(data.isUserLoggedIn) {
						vm.user
							.setId(data.user._id)
							.setName(data.user.name)
					}
					
					// set user state from response
					vm.isUserBookmarkedThisBoard = data.isUserBookmarkedThisBoard;
					vm.isUserCollaborator = data.isUserCollaborator;
					vm.isUserInRequestingToBeCollaborator = data.isUserInRequestingToBeCollaborator;
					vm.isUserLoggedIn = data.isUserLoggedIn;
					vm.isUserOwnerOfBoard = data.isUserOwnerOfBoard;
					vm.isUserCollaboratorRequestRejected = data.isUserCollaboratorRequestRejected;

					// if user is board owner, so get boardCollaborators and board collaborator request
					if(data.isUserOwnerOfBoard) {
						
						data.boardCollaboratorsRequest.forEach(function(request) {
							vm.collaboratorsRequest.push(request);
						});

						data.boardCollaborators.forEach(function(collaborator) {
							vm.boardCollaborators.push(collaborator);
						})
					}

					// get card data
					data.boardCards.forEach(function(card) {
						
						var cardInstance = new Card();
						
						var creatorOfCard = new User();
						creatorOfCard
							.setId(card.creator.id)
							.setName(card.creator.name)

						var cardRelation = new Relation();
							cardRelation
								.setTo(card.related.to)
								.setType(card.related.type);

						cardInstance
							.setId(card._id)
							.setTitle(card.title)
							.setContent(card.content)
							.setType(card.type)
							.setCreator(creatorOfCard)
							.setLeft(card.left)
							.setTop(card.top)
							.setRelation(cardRelation);

						vm.cards.push(cardInstance);
					});
				})
				.catch(function(error) {
					vm.notifyThatSomethingError('Gagal melakukan load data awal');
				});
		},
		openCreateBoardToCreateContention : function() {
			this.formStatus = 'create-contention';
			this.tobe.sendCardType = 'contention';

			this.openCreateCardModal();
		},
		openCreateCardModal : function() {
			this.modals.createCard.modal({
				keyboard : false,
				backdrop : 'static'
			})
		},
		closeCreateCardModal : function() {
			this.modals.createCard.modal('hide');
		},
		openDeleteCardConfimationModal : function() {
			this.modals.deleteCardConfirmation.modal({
				backdrop : 'static',
				keyboard : false
			})
		},
		closeDeleteCardConfirmationModal : function() {
			this.modals.deleteCardConfirmation.modal('hide');
		},
		createCard : function(event) {
			
			var vm = this;

			if(this.isFormInEdit()) {
				this.editCard();
				return;
			}

			vm.loadings.cardSubmit = true;

			var newCardFormData = new CreateCardForm();
			var pageX = event.pageX;
			var pageY = event.pageY;

			newCardFormData
				.setTitle(this.forms.createCard.title)
				.setContent(this.getCardContent())
				.setType(vm.tobe.sendCardType)
				.setPageX(pageX)
				.setPageY(pageY);

				
			if(vm.formStatus != 'create-contention') {
				newCardFormData
					.setRelatedTo(vm.tobe.relatedId)
					.setRelationType(vm.tobe.sendCardType);
			}

			var request = $.post({
				url: '/api/board/'+ vm.board.getId() +'/card',
				data : JSON.stringify(newCardFormData.toPlainObject()),
				contentType : 'application/json; charset=UTF-8',
			});

			request.then(function(message) {
				vm.loadings.cardSubmit = false;
				
				vm.notifyThatSomethingSuccess('Card Telah Tersimpan');
				vm.closeCreateCardModal();
			})
			.catch(function(error) {
				vm.loadings.cardSubmit = false;

				vm.handleError(error, function(error) {
					if(error.status == 400) {
						var error = JSON.parse(error.responseText);
						vm.handleValidationErrors(error.errors);
					}
				});
			})
		},
		getCardContent : function() {
			return this.editor.summernote('code');
		},
		scaleChange : function(event) {
			var leftSubtractValueMap = {
				'0.2' 	: 10,
				'0.3' 	: 10,
				'0.4' 	: 10,
				'0.5' 	: 10,
				'0.6' 	: 10,
				'0.7' 	: 10,
				'0.8' 	: 10,
				'0.9' 	: 10,
				'1' 	: 10
			};

			var topSubtractValueMap = {
				'0.2'	: 500,
				'0.3'	: 320,
				'0.4' 	: 250,
				'0.5'	: 190,
				'0.6'	: 170,
				'0.7'	: 150,
				'0.8'	: 130,
				'0.9' 	: 100,
				'1' 	: 90
			};

			this.scale = parseFloat(event.target.value);;

			var scaleValue = parseFloat(event.target.value);
			var scaleCssValue = 'scale(' + scaleValue.toString() + ')';

			$("#argumen-container").css({
				"-webkit-transform"	: scaleCssValue,
				"-moz-transform"	: scaleCssValue,
				"-ms-transform"		: scaleCssValue,
				"-o-transform"		: scaleCssValue,
				"transform"			: scaleCssValue,
				"-webkit-transform-origin": 'left 0.1%'
			});

			jsPlumb.setZoom(scaleValue);

			this.leftSubtractValue = leftSubtractValueMap[scaleValue.toString()];
			this.topSubtractValue = topSubtractValueMap[scaleValue.toString()];
			
		},
		saveCardPositionChange : function(args) {
			
			var cardIdToBeUpdated = this.cards[args.index].getId();
			var url = '/api/card/'+ cardIdToBeUpdated +'/updatePosition'
			var boardId = this.board.getId();

			var data = {
				top : args.pageX, 
				left : args.pageY,
				boardId : boardId
			}

			var request = $.post({
				url: url,
				data : JSON.stringify(data),
				contentType : 'application/json; charset=UTF-8',
			});

			request
				.catch(function(error) {
					vm.notifyThatSomethingError('Perpindahan posisi card tidak tersimpan, mungkin koneksi anda bermasalah')
				})
		},
		openModalAndSetCardToBeDeleted : function(args) {
			this.tobe.deletedCardIndex = args.index;
			this.openDeleteCardConfimationModal();
		},
		deleteCardByIndex : function() {

			var vm = this;

			var cardIdToBeDeleted = this.cards[this.tobe.deletedCardIndex].getId();
			var url = '/api/card/'+ cardIdToBeDeleted +'/delete'
			var boardId = this.board.getId();

			//check if any card related to this cardData
			var relatedCards = vm.cards.filter(function(card) {
			 	return card.getRelatedTo() == cardIdToBeDeleted;
			});

			if(relatedCards.length) {
			 	toastr.warning('Anda tidak bisa menghapus card yang berelasi dengan card lain, hapus card yang berelasi dengan card ini dulu.');
			 	vm.closeDeleteCardConfirmationModal();
			 	return;
			}

			vm.loadings.cardDelete = true;

			var data = {
				boardId : boardId
			}

			var request = $.post({
				url: url,
				data : JSON.stringify(data),
				contentType : 'application/json; charset=UTF-8',
			});

			request
				.then(function(data) {
					vm.loadings.cardDelete = false;

					vm.closeDeleteCardConfirmationModal();
					toastr.success('Card telah terhapus');
				})
				.catch(function(error) {
					vm.loadings.cardDelete = false;
					
					vm.handleError(error);
					vm.closeDeleteCardConfirmationModal();
				})	
		},
		createRelatedCard : function(args) {
			var vm = this;

			vm.tobe.relatedId = vm.cards[args.index].getId();  
			vm.formStatus = 'create-' + args.type;
			vm.tobe.sendCardType = args.type
			
			vm.openCreateCardModal();
		},
		addCardConnection : function(connection) {
			this.connections.push(connection)
		},
		removeConnectionByCardId : function(args) {
			
			var vm = this;

			var deletedCardId = args.cardId;
			
			var toBeDeletedConnections = this.connections.filter(function(connection) {
				return connection.target == deletedCardId || connection.source == deletedCardId;
			});
			
			toBeDeletedConnections.forEach(function(connection) {
				
				var connectionIndexToBeDeleted = R.findIndex(R.propEq('source', connection.source) && R.propEq('target', connection.target), vm.connections);
				
				jsPlumb.detach(vm.connections[connectionIndexToBeDeleted].connection);
				vm.connections.splice(connectionIndexToBeDeleted, 1);
			})
		},
		openModalToChangeCard : function(args) {
			var vm = this;

			this.tobe.changedCardIndex = args.index;
			
			var cardIdToBeEdited = this.cards[args.index].getId();
			var cardTypeToBeEdited = this.cards[args.index].getType();
			var cardTitleToBeEdited = this.cards[args.index].getTitle();

			var url = '/api/card/' + cardIdToBeEdited + '/catatan';

			var request = $.get({
				url : url
			});

			request
				.then(function(data) {
					vm.formStatus = 'edit-' + cardTypeToBeEdited;
					vm.editor.summernote("code", data.catatan);
					vm.forms.createCard.title = cardTitleToBeEdited;
					vm.openCreateCardModal();
				})
				.catch(function(error) {
					vm.notifyThatSomethingError('Anda tidak dapat mengedit card yang bukan milik anda');
				})
		},
		editCard : function() {
			
			var vm = this;

			vm.loadings.cardSubmit = true;

			var cardIdToBeEdited = this.cards[this.tobe.changedCardIndex].getId();
			var url = '/api/card/'+ cardIdToBeEdited +'/update';
			
			var data = {
				title : this.forms.createCard.title,
				content : this.getCardContent(),
				boardId : vm.board.getId()
			}

			var request = $.post({
				url: url,
				data : JSON.stringify(data),
				contentType : 'application/json; charset=UTF-8',
			});

			request.then(function(message) {
				vm.loadings.cardSubmit = false;

				vm.closeCreateCardModal();
			})
			.catch(function(error) {
				
				vm.loadings.cardSubmit = false;

				vm.handleError(error, function(error) {
					if(error.status == 400) {
						var error = JSON.parse(error.responseText);
						vm.handleValidationErrors(error.errors);
					}
				});
			})
		},
		isFormInEdit : function() {
			
			var vm = this;

			var editStatuses = [
				'edit-contention',
				'edit-objection',
				'edit-reason',
				'edit-co-reason',
				'edit-rebuttal'
			];

			var formStatusInEditStatuses = editStatuses.find(function(status) {
				return vm.formStatus == status;
			});

			return formStatusInEditStatuses != undefined;
		},
		requestToJoinBoard : function() {
			var vm = this;

			vm.loadings.requestToBeCollaborator = true;

			var boardId = $('meta[name=boardId]').attr("content");
			var url = '/api/board/' + boardId + '/join';

			var request = $.post({
				url : url
			})

			request
				.then(function(collaboratorsRequest) {

					vm.isUserInRequestingToBeCollaborator = true;
					vm.loadings.requestToBeCollaborator = false;
				})
				.catch(function(error) {

					vm.loadings.requestToBeCollaborator = false;
					vm.handleError(error)
				})
		},
		openCollaboratorsModal : function() {
			this.modals.collaborators.modal({
				backdrop : 'static',
				keyboard : false
			})
		},
		hideCollaboratorsModal : function() {
			this.modals.collaborators.modal('hide');
		},
		acceptCollaboratorRequest : function(userId, index) {
			var vm = this;

			vm.loadings.acceptJoin = true;
			vm.tobe.acceptedCollaboratorRequestIndex = index;

			var boardId = $('meta[name=boardId]').attr("content");
			var url = '/api/board/' + boardId + '/accept-join';

			var request = $.post({
				url : url,
				data : JSON.stringify({ userId : userId }),
				contentType : 'application/json; charset=UTF-8',
			});

			request
				.then(function(collaborator) {

					vm.loadings.acceptJoin = false;
					vm.boardCollaborators.push(collaborator);
					vm.collaboratorsRequest.splice(index, 1);
					vm.tobe.acceptedCollaboratorRequestIndex = null;
				})
				.catch(function(error) {
					vm.tobe.acceptedCollaboratorRequestIndex = null;
					vm.loadings.acceptJoin = false;
					vm.handleError(error);
				})
		},
		uploadImage : function(image) {
			
			var formData = new FormData();
			formData.append('image', image);

			var uploadUrl = '/api/upload-image';

			var request = $.post({
				url : uploadUrl,
				data : formData,
				contentType : false,
				processData : false
			});

			return request;
		},
		rejectCollaboratorRequest : function(userId, index) {
			var vm = this;

			vm.loadings.rejectJoin = true;
			vm.tobe.rejectedCollaboratorRequestIndex = index;

			var boardId = $('meta[name=boardId]').attr("content");
			var url = '/api/board/' + boardId + '/reject-join';

			var request = $.post({
				url : url,
				data : JSON.stringify({ userId : userId }),
				contentType : 'application/json; charset=UTF-8',
			});

			request
				.then(function(collaborator) {
				
					vm.collaboratorsRequest.splice(index, 1);
					vm.loadings.rejectJoin = false;
					vm.tobe.rejectedCollaboratorRequestIndex = null;
				})
				.catch(function(error) {

					vm.tobe.rejectedCollaboratorRequestIndex = null;
					vm.loadings.rejectJoin = false;
					vm.handleError(error);
				})
		},
		bookmarkThisBoard : function() {
			var vm = this;

			vm.loadings.bookmarkRequest = true;

			var boardId = $('meta[name=boardId]').attr("content");
			var url = '/api/board/' + boardId + '/bookmark';

			var request = $.post({
				url : url,
			});

			request
				.then(function() {
					
					vm.isUserBookmarkedThisBoard = true;
					vm.loadings.bookmarkRequest = false;
				})
				.catch(function(error) {
					
					vm.loadings.bookmarkRequest = false;
					vm.handleError(error);
				})
		},
		removeBookmarkThisBoard : function(){
			var vm = this;

			vm.loadings.bookmarkRequest = true;

			var boardId = $('meta[name=boardId]').attr("content");
			var url = '/api/board/' + boardId + '/remove-bookmark';

			var request = $.post({
				url : url,
			});

			request
				.then(function() {
				
					vm.isUserBookmarkedThisBoard = false;
					vm.loadings.bookmarkRequest = false;
				})
				.catch(function(error) {
					vm.loadings.bookmarkRequest = false;
					vm.handleError(error);
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

			if(error.status == 500) {
				vm.notifyThatSomethingError('Mohon maaf, terjadi error pada server.');
				if(typeof callback == 'function') {
					callback.bind(vm)(error);
				}
			}
		},
		handleValidationErrors : function(errors) {
			
			var vm = this;

			var params = ['title'];

			params.forEach(function(param) {
				var paramError = errors.find(function(error) {
					return error.param == param
				})

				if(paramError != undefined) {

					vm.formsError.createCard[param].error = true;
					vm.formsError.createCard[param].message  = paramError.msg
				}
			})
		},
		resetFormErrorState : function(param) {
			this.formsError.createCard[param].error = false;
		},
		resetAllFormErrorState : function() {
			var vm = this;

			var params = ['title'];

			params.forEach(function(param) {
				vm.resetFormErrorState(param);
			})
		},
		initializeContainer : function() {
			
			var fakeEvent = {
				target : {
					value : 1
				}
			};

			this.scaleChange(fakeEvent);

			jsPlumb.setZoom(1);
			
			var scaleCssValue = 'scale(1)';
			
			$("#argumen-container").css({
				"-webkit-transform"	: scaleCssValue,
				"-moz-transform"	: scaleCssValue,
				"-ms-transform"		: scaleCssValue,
				"-o-transform"		: scaleCssValue,
				"transform"			: scaleCssValue,
				"-webkit-transform-origin": 'left 0.1%'
			});
		}
	},
	computed : {
		createFormTitle : function() {
			var formTitleMappingFormStatus = {
				'create-contention' : 'Buat Kesimpulan',
				'create-objection' : 'Buat Keberatan',
				'create-reason' : 'Buat Alasan',
				'create-co-reason' : 'Buat Sub Alasan',
				'create-rebuttal' : 'Buat Bantahan',
				'edit-contention' : 'Ubah Kesimpulan',
				'edit-objection' : 'Ubah Keberatan',
				'edit-reason' : 'Ubah Alasan',
				'edit-co-reason' : 'Ubah Sub Alasan',
				'edit-rebuttal' : 'Ubah Bantahan'
			};

			return formTitleMappingFormStatus[this.formStatus];
		},
		numberOfCollaboratorsRequest : function() {
			return this.collaboratorsRequest.length;
		}
	},
	mounted :function() {
		
		var vm = this;

		jsPlumb.setContainer("argumen-container");
		vm.initializeContainer();

		toastr.options = {
		  "closeButton": false,
		  "debug": false,
		  "newestOnTop": false,
		  "progressBar": true,
		  "positionClass": "toast-bottom-right",
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

		this.getViewBoardPageData()
			.then(function() {

				$('[data-toggle="popover"]').popover({
					container: 'body'
				}); 
			
				vm.sockets.card = io('/card');

				if(vm.isUserOwnerOfBoard) {

					var collaboratorsRequestAddedEventName = vm.board.getId() + ':collaborator-request-added';
					
					vm.sockets.card.on(collaboratorsRequestAddedEventName, function(userData) {
						vm.collaboratorsRequest.push(userData)
					})
				}

				var cardCreatedEventName = vm.board.getId() + ':card-created';
				
				vm.sockets.card.on(cardCreatedEventName, function(newCard) {
					
					var cardInstance = new Card();
					
					var creatorOfCard = new User();
					creatorOfCard
						.setId(newCard.creator.id)
						.setName(newCard.creator.name);

					var cardRelation = new Relation();
						cardRelation
							.setTo(newCard.related.to)
							.setType(newCard.related.type);

					cardInstance
						.setId(newCard._id)
						.setTitle(newCard.title)
						.setType(newCard.type)
						.setCreator(creatorOfCard)
						.setLeft(newCard.left)
						.setTop(newCard.top)
						.setRelation(cardRelation);

					vm.cards.push(cardInstance);
				})

				var cardPositionChangedEventName = vm.board.getId() + ':card-position-changed';
				
				vm.sockets.card.on(cardPositionChangedEventName, function(cardData) {
					var indexOfCardToBeChangedPosition = R.findIndex(R.propEq('id', cardData.cardId), vm.cards);
					vm.cards[indexOfCardToBeChangedPosition].setTop(cardData.top);
					vm.cards[indexOfCardToBeChangedPosition].setLeft(cardData.left);

					setTimeout(function() {
						jsPlumb.repaintEverything();
					}, 500)
				})

				var cardDeletedEventName = vm.board.getId() + ':card-deleted';
				
				vm.sockets.card.on(cardDeletedEventName, function(cardData) {
					
					vm.removeConnectionByCardId(cardData);

					var indexOfCardToBeDeleted = R.findIndex(R.propEq('id', cardData.cardId), vm.cards);
					vm.cards.splice(indexOfCardToBeDeleted, 1)
				})

				var cardUpdatedEventName = vm.board.getId() + ':card-updated';
				
				vm.sockets.card.on(cardUpdatedEventName, function(cardData) {
					
					var indexOfCardToBeUpdated = R.findIndex(R.propEq('id', cardData.cardId), vm.cards);
					vm.cards[indexOfCardToBeUpdated].setTitle(cardData.title);
				})

				var collaboratorAddedEventName = vm.board.getId() + ':collaborator-added';
				
				vm.sockets.card.on(collaboratorAddedEventName, function(userData) {
					vm.board.collaboratorIds.push(userData.userId);
				})

				var currentUserChangeCollaboratorState = vm.board.getId() + ':' + vm.user.getId() + ':collaboratoration-state-change';
				
				vm.sockets.card.on(currentUserChangeCollaboratorState, function(userCollaborationState) {
					if(userCollaborationState.value) {
						vm.isUserCollaborator = true;
						vm.isUserInRequestingToBeCollaborator = false;
					} else {
						vm.isUserCollaboratorRequestRejected = true;
						vm.isUserInRequestingToBeCollaborator = false;
					}
				})

			});
		
		this.editor = $('#content-editor');

		this.editor.summernote({
			toolbar: [
			    ['style', ['bold', 'italic', 'underline', 'clear']],
			    ['font', ['strikethrough']],
			    ['fontsize', ['fontsize']],
			    ['color', ['color']],
			    ['para', ['ul', 'ol', 'paragraph']],
			    ['height', ['height']],
			    ['insert', ['picture', 'link', 'video']]
			],
			height: 200,
		  	minHeight: null,
			maxHeight: null,
			focus: true,
			dialogsInBody: true,
			lang: 'id-ID',
			callbacks : {
				onImageUpload: function(images) {
					
					vm.uploadImage(images[0])
					.then(function(data) {
						vm.editor.summernote('editor.insertImage', data.imageUrl);
					})
					.catch(function(error) {
						vm.notifyThatSomethingError('Gagal unggah gambar');
					})
				}
			}
		});

		this.modals.createCard = $('#create-card-modal');
		this.modals.deleteCardConfirmation = $('#delete-card-confirmation-modal');

		this.modals.createCard.on('hide.bs.modal', function() {
			vm.forms.createCard.title = '';
			vm.editor.summernote('reset');
			vm.resetAllFormErrorState(); 
		})

		if($('#collaborator-modal').length) {
			vm.modals.collaborators = $('#collaborator-modal');
		}
	}
})