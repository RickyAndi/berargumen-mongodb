var authMiddleware = require('../middlewares/auth');
var boardPostValidatorMiddleware = require('../middlewares/boardPostValidator');

var mongoose = require('mongoose');

var Board = require('../models/board');
var User = require('../models/user');
var Card = require('../models/card');

var multer  = require('multer')
var upload = multer({ 
	dest: 'public/uploads/',
	limits : {
		fileSize : 1000000
	}
})

var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = function(app, io) {

	app.get('/api/me', function(req, res) {
		if(!req.user) {
			res
				.status(401)
				.json({
					message : 'User Not Authorized'
				})
		}

		res
			.status(200)
			.json(req.user)
	})

	app.get('/api/users', function(req, res) {
		User.find().then(function(users) {
			res.json(users);
		})
	})
	
	app.get('/api/my-boards', authMiddleware, async(function(req, res) {
		
		var userId = req.user._id;
		var page = req.query.page;
		var searchQuery = req.query.q;

		try {

			if(searchQuery && searchQuery != '') {

				var boards = await(Board.paginate({ 
					'user.id': mongoose.Types.ObjectId(userId),
					$text : { 
						$search : searchQuery 
					},
				}, { 
					page: page, 
					limit: 10,
					sort : { 
						updated : -1 
					}
				}));
			
			} else {
				
				var boards = await(
					Board.paginate({ 
						'user.id': mongoose.Types.ObjectId(userId) 
					}, { 
						page: page, 
						limit: 10, 
						sort : { 
							updated : -1 
						} 
					}));
			
			}
			
			
			res
				.json(boards);

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				})
		}
		
	}))

	app.get('/api/bookmarked-boards', authMiddleware, async(function(req, res) {
		
		var userId = req.user._id;
		var page = req.query.page;
		var searchQuery = req.query.q;

		try {
			

			if(searchQuery && searchQuery != '') {
				
				var boards = await(
					Board.paginate({ 
						$text : { 
							$search : searchQuery 
						},
						'bookmarkedBy.' : mongoose.Types.ObjectId(userId) 
					}, { 
						page: page, 
						limit: 10,
						sort : { 
							updated : -1 
						}
					})
				);

			} else {

				var boards = await(Board
					.paginate({ 
						'bookmarkedBy.' : mongoose.Types.ObjectId(userId) 
					}, { 
						page: page, 
						limit: 10,
						sort : { 
							updated : -1 
						}
					}));
			}
			
			
			res
				.json(boards)

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				})
		}
		
	}));

	app.get('/api/tag/boards', async(function(req, res) {
		
		var tag = req.query.tag;
		var page = req.query.page;

		try {
			
			var boards = await(Board
				.paginate({ 
					'tags' : tag 
				}, { 
					page: page, 
					limit: 10,
					sort : { 
						updated : -1 
					}
				}));
			
			res
				.json(boards);

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				});
		}
		
	}));

	app.get('/api/boards', async(function(req, res) {

		var page = req.query.page;
		var searchQuery = req.query.q;

		try {
			
			if(searchQuery && searchQuery != '') {
				
				var boards = await(
					Board.paginate({ 
						$text : { 
							$search : searchQuery 
						}
					}, { 
						page: page, 
						limit: 10, 
						sort : { 
							updated : -1 
						} 
					})
				);
			
			} else {

				var boards = await(Board.paginate({}, { 
					page: page, 
					limit: 10, 
					sort : { 
						updated : -1 
					} 
				}));	
			
			}
			
			res
				.status(200)
				.json(boards);

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				})
		}
		
	}))

	app.get('/api/user/:userId/boards', async(function(req, res) {

		var page = req.query.page;
		var userId = req.params.userId;
		
		try {
			
			var boards = await(Board.paginate({'user.id' : userId }, { 
				page: page, 
				limit: 10,
				sort : { 
					updated : -1 
				} 
			}));
			
			res
				.status(200)
				.json(boards)

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				})
		}
		
	}))

	app.get('/api/collaborated-boards', authMiddleware, async(function(req, res) {
		
		var userId = req.user._id;
		var page = req.query.page;
		var searchQuery = req.query.q;

		try {

			if(searchQuery && searchQuery != '') {

				var boards = await(Board.paginate({ 
					collaborators : { 
						$elemMatch : { 
							userId : mongoose.Types.ObjectId(userId) 
						}
					},
					$text : { $search : searchQuery }
				}, { 
						page: page, 
						limit: 10,
						sort : { 
							updated : -1 
						}
					})
				);

			} else {

				var boards = await(Board.paginate({ 
					collaborators : { 
						$elemMatch : { 
							userId : mongoose.Types.ObjectId(userId) 
						}
					}}, { 
						page: page, 
						limit: 10,
						sort : { 
							updated : -1 
						}
					})
				);
			}
			
			
			res
				.json(boards);

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				})
		}
		
		
	}));

	app.post('/api/board', authMiddleware, boardPostValidatorMiddleware, async(function(req, res) {
		
		var userId = mongoose.Types.ObjectId(req.user._id);
		var userName = req.user.name;

		var tags = req.body.tags.split(','); 
		
		if(!tags.length) {
			tags = [];
		}
		
		var newBoard = new Board({
			user : {
				id : userId,
				name : userName
			},
			title : req.body.title,
			description : req.body.description,
			tags : tags
		})

		try {
			
			var newBoard = await(newBoard.save());
			
			res
				.status(200)
				.json(newBoard);
		
		} catch(error) {

			res
				.status(500)
				.json({ 
					message : 'Error Happen'
				});
		}

	}));

	app.post('/api/board/:boardId/update', authMiddleware, boardPostValidatorMiddleware, async(function(req, res) {
		
		var boardId = req.params.boardId;

		var title = req.body.title;
		var description = req.body.description;
		var tags = req.body.tags.split(','); 
		var user = req.user;

		if(!tags.length) {
			tags = [];
		}

		try {
			var updatedBoard = await(Board.findOneAndUpdate({ _id: boardId, 'user.id' : user._id }, {
				$set : {
					title : title,
					description : description,
					tags : tags
				}
			}));

			if(!updatedBoard) {
				res
					.status(404)
					.json({
						message : 'Board Not Found'
					})
			}

			setTimeout(function() {
				res
					.status(200)
					.json(updatedBoard)
			}, 9000)
			

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				})
		}

	}));

	app.get('/api/card/:cardId/catatan', async(function(req, res) {

		var cardId = req.params.cardId;
		var userId = req.user._id;
		var boardId = req.body.boardId;

		try {

			var card = await(Card.findOne({ _id : cardId, 'creator.id' : userId}));

			if(!card) {
				res
					.status(404)
					.json({
						message : 'Card Not Found'
					})
			}

			var cardData = {
				catatan : card.content
			};

			res
				.status(200)
				.json(cardData);

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				})

		}
	}))

	app.post('/api/card/:cardId/update', authMiddleware, async(function(req, res) {

		var cardId = req.params.cardId;
		var userId = req.user._id;
		var boardId = req.body.boardId;
		var isi = req.body.title;
		var catatan = req.body.content;

		try {

			var card = await(Card.findOneAndUpdate({ 
				_id : cardId, 
				'creator.id' : userId
			}, {
				title : isi,
				content : catatan
			}));

			if(!card) {
				res.status(404).json({
					message : 'Card Not Found'
				})
			}

			var cardUpdatedEventName = boardId + ':card-updated';
			
			var payload = {
				cardId : card._id,
				title : isi
			}

			io.card.emit(cardUpdatedEventName, payload);
			
			res.status(200).json({
				message : 'Card Updated'
			})

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				})
		}
	}));

	app.post('/api/card/:cardId/delete', authMiddleware, async(function(req, res) {

		var cardId = req.params.cardId;
		var userId = req.user._id;
		var boardId = req.body.boardId;

		try {

			var cardsThatRelatedToToBeDeletedCard = await(Card.find({ 'related.to' : cardId }));

			if(cardsThatRelatedToToBeDeletedCard.length) {
				
				res
					.status(400)
					.json({
						message : 'Anda tidak bisa menghapus card yang berelasi dengan card lain, hapus card yang berelasi dengan card ini dulu.'
					});

				return;
			}

			var card = await(Card.findOneAndUpdate({ 
				_id : cardId, 
				'creator.id' : userId
			}, {
				deleted : true
			}));

			if(!card) {
				res.status(404).json({
					message : 'Card Not Found'
				})
			}

			var cardDeletedEventName = boardId + ':card-deleted';
			
			var payload = {
				cardId : card._id 
			}

			io.card.emit(cardDeletedEventName, payload);
			
			res.status(200).json({
				message : 'Card Deleted'
			})

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				})

		}
	}))

	app.post('/api/card/:cardId/updatePosition', authMiddleware, async(function(req, res) {
		
		var cardId = req.params.cardId;
		var userId = req.user._id;
		var boardId = req.body.boardId;

		try {

			var board = await(Board.findOne({
				_id : boardId,
				'user.id' : userId
			}));

			if(!board) {
				
				var card = await(Card.findOneAndUpdate({ 
					_id : cardId, 
					'creator.id' : userId
				}, {
					top : req.body.top,
					left : req.body.left
				}));

				if(!card) {
					res
						.status(404)
						.json({
							message : 'Card Not Found'
						})
				}

				var cardCreatedEventName = boardId + ':card-position-changed';
				
				var payload = {
					top : req.body.top,
					left : req.body.left,
					cardId : card._id 
				}

				io.card.emit(cardCreatedEventName, payload);
				
				res
					.status(200)
					.json({
						message : 'Card Position Updated'
					})
			}

			var card = await(Card.findOneAndUpdate({ 
				_id : cardId 
			}, {
				top : req.body.top,
				left : req.body.left
			}));

			if(!card) {
				res
					.status(404)
					.json({
						message : 'Card Not Found'
					})	
			}

			var cardCreatedEventName = boardId + ':card-position-changed';
			
			var payload = {
				top : req.body.top,
				left : req.body.left,
				cardId : card._id 
			}

			io.card.emit(cardCreatedEventName, payload);
			
			res
				.status(200)
				.json({
					message : 'Card Position Updated'
				})

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				})
		}
	}))

	app.get('/api/board/:boardId/collaborators-request', authMiddleware, async(function(req, res) {
		
		var boardId = req.params.boardId;
		var userId = req.user._id; 

		try {

			var board = await(Board.findOne({ _id : boardId, 'user.id' : userId}));

			if(!board) {
				res
					.status(404)
					.json({
						message : 'Board Not found'
					})
			}

			var collaboratorsRequest = board.collaboratorsRequest.map(function(collaboratorRequest) {
				return {
					userId : collaboratorRequest.userId,
					name : collaboratorRequest.name,
					profilePic : collaboratorRequest.profilePic
				}
			})

			res
				.status(200)
				.json(collaboratorsRequest);
			

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				})
		}
	}))

	app.get('/api/board/:boardId/collaborators', authMiddleware, async(function(req, res) {
		
		var boardId = req.params.boardId;
		var userId = req.user._id; 

		try {

			var board = await(Board.findOne({ _id : boardId, 'user.id' : userId}));

			if(!board) {
				res
					.status(404)
					.json({
						message : 'Board Not found'
					})
			}

			res
				.status(200)
				.json(board.collaborators)

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				})
		}
	}))

	app.post('/api/board/:boardId/join', authMiddleware, async(function(req, res) {
		
		var boardId = req.params.boardId;
		
		var userData = {
			userId : req.user._id,
			name : req.user.name,
			profilePic : req.user.profilePicUrl
		}

		try {

			var board = await(Board.findByIdAndUpdate(boardId, { 
				$push : { 
					collaboratorsRequest : userData 
				}
			}, {
				safe: true, 
				upsert: true
			}));

			var boardCollaboratorRequestAddedEventName = boardId + ':collaborator-request-added';
			
			io.card.emit(boardCollaboratorRequestAddedEventName, userData);

			res
				.status(200)
				.json({
					message : 'Request Completed'
				})

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				})

		}
	}))

	app.post('/api/board/:boardId/bookmark', authMiddleware, async(function(req, res) {

		var boardId = req.params.boardId;
		var userId = req.user._id;

		try {

			var board = await(Board.findById(boardId));

			if(!board) {
				res
					.status(404)
					.json({
						message : 'Boar Not Found'
					})
			}

			var isUserIdInBookmarkedBy = board.bookmarkedBy.find(function(userIdThatBookmarkedThisBoard) {
				return userId == userIdThatBookmarkedThisBoard; 
			});

			if(isUserIdInBookmarkedBy == undefined) {
				
				var updatedBoard = await(Board.update({ _id : boardId}, {
					$push : { bookmarkedBy : mongoose.Types.ObjectId(userId) }
				}));

				res
					.status(200)
					.json({
						message : 'Successfully bookmarked'
					});

			} else {
				res
					.status(400)
					.json({
						message : 'Already Bookmarked'
					})
			}

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				});
		}

	}));

	app.post('/api/board/:boardId/remove-bookmark', authMiddleware, async(function(req, res) {
		
		var boardId = req.params.boardId;
		var userId = req.user._id;

		try {

			var board = await(Board.findById(boardId));

			if(!board) {
				res
					.status(404)
					.json({
						message : 'Board Not Found'
					})
			}

			var isUserIdInBookmarkedBy = board.bookmarkedBy.find(function(userIdThatBookmarkedThisBoard) {
				return userId == userIdThatBookmarkedThisBoard; 
			});

			if(isUserIdInBookmarkedBy != undefined) {
				
				var updatedBoard = await(Board.update({ _id : boardId}, {
					$pull : { bookmarkedBy : mongoose.Types.ObjectId(userId) }
				}));


				res
					.status(200)
					.json({
						message : 'Bookmark successfully removed'
					});

			} else {
				res
					.status(400)
					.json({
						message : 'Trying to remove bookmark, but this board is not bookmarked'
					})
			}

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				});
		}

	}));

	app.post('/api/board/:boardId/accept-join', authMiddleware, async(function(req, res) {
		
		var boardId = req.params.boardId;
		var idToBeAddedToCollaborators = req.body.userId;
		var boardOwnerId = req.user._id;

		try {

			var board = await(Board.findOne({ _id : boardId, 'user.id' : boardOwnerId}));

			if(!board) {
				res
					.status(404)
					.json({
						message : 'Board Not Found'
					})
			}

			var collaboratorsRequests = board.collaboratorsRequest;

			var collaboratorToBeAdded = collaboratorsRequests.find(function(request) {
				return request.userId == idToBeAddedToCollaborators;
			})

			var updatedBoard = await(Board.update({ _id : boardId}, {
				$push : { collaborators : collaboratorToBeAdded },
				$pull : { collaboratorsRequest : { userId : idToBeAddedToCollaborators }}
			}));
			
			var boardCollaboratorAddedEventName = boardId + ':collaborator-added';
			io.card.emit(boardCollaboratorAddedEventName, { userId : idToBeAddedToCollaborators });
			
			var boardCollaboratorAddedEventName = boardId + ':' + idToBeAddedToCollaborators + ':collaboratoration-state-change';
			io.card.emit(boardCollaboratorAddedEventName, { 
				value : true 
			});
			
			res
				.status(200)
				.json({
					userId : collaboratorToBeAdded.userId,
					name : collaboratorToBeAdded.name,
					profilePic : collaboratorToBeAdded.profilePic
				})

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				})
		}
	}));

	app.post('/api/board/:boardId/reject-join', authMiddleware, async(function(req, res) {
		
		var boardId = req.params.boardId;
		var idToBeRejected = req.body.userId;
		var boardOwnerId = req.user._id;

		try {

			var board = await(Board.findOne({ _id : boardId, 'user.id' : boardOwnerId}));

			if(!board) {
				res
					.status(404)
					.json({
						message : 'Board Not Found'
					})
			}

			var collaboratorsRequests = board.collaboratorsRequest;

			var collaboratorToBeRejected = collaboratorsRequests.find(function(request) {
				return request.userId == idToBeRejected;
			})

			var updatedBoard = await(Board.update({ _id : boardId}, {
				$push : { rejectedCollaboratorsRequest : collaboratorToBeRejected },
				$pull : { collaboratorsRequest : { userId : idToBeRejected }}
			}));
			
			var boardCollaboratorAddedEventName = boardId + ':' + idToBeRejected  + ':collaboratoration-state-change';
			io.card.emit(boardCollaboratorAddedEventName, { 
				value : false 
			});
			
			res
				.status(200)
				.json({
					message : 'Request Rejected Successfully'
				})

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				})
		}
	}))


	app.post('/api/board/:boardId/card', authMiddleware, async(function(req, res) {
		
		var boardId = req.params.boardId;
		
		try {

			var board = await(Board.findById(boardId));

			if(!board) {
				res.status(404).json({
					message : 'Board Not Found'
				})
			}

			var userId = mongoose.Types.ObjectId(req.user._id);
			var boardId = mongoose.Types.ObjectId(req.params.boardId);
			var userName = req.user.name;
			var cardTitle = req.body.title;
			var cardContent = req.body.content;
			var cardType = req.body.type;
			var cardTop = req.body.pageY.toString() + 'px';
			var cardLeft = req.body.pageX.toString() + 'px';
			var cardId = null;
			var relationType = null;

			if(req.body.related.to != null) {
				cardId = mongoose.Types.ObjectId(req.body.related.to);
				relationType = req.body.related.type; 
			} 

			var cardToSaved = new Card({
				creator : {
					id : userId,
					name : userName
				},
				title : cardTitle,
				content : cardContent,
				type : cardType,
				top : cardTop,
				left : cardLeft,
				related : {
					to : cardId,
					type : relationType
				},
				boardId : boardId
			})

			var newCard = await(cardToSaved.save());

			var cardCreatedEventName = boardId + ':card-created';

			io.card.emit(cardCreatedEventName, newCard);

			res
				.status(200)
				.json({
					message : 'Card Created'
				})

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				})	

		}
	}))

	app.get('/api/board/:boardId/cards', async(function(req, res) {
		
		var boardId = req.params.boardId;
		
		try {

			var board = await(Board.findById(boardId));

			if(!board) {
				res
					.status(404)
					.json({
						message : 'Board Not Found'
					})
			}

			var cards = await(Card.find({ 
				boardId : boardId,
				deleted : false 
			}));

			res
				.status(200)
				.json(cards)

		} catch(error) {
			
			res
				.status(500)
				.json({
					message : 'Error Happen'
				})			
		}
	}))

	app.get('/api/board/:boardId', async(function(req, res) {

		var boardId = req.params.boardId;

		try {

			var board = await(Board.findById(boardId));

			if(!board) {
				res
					.status(404)
					.json({
						message : 'Board Not Found'
					})
			}

			res
				.status(200)
				.json(board)


		} catch(error) {
			
			res
				.status(500)
				.json({
					message : error.toString()
				})
		}
	}))

	app.post('/api/upload-image', upload.single('image'), function(req, res) {
		res
			.json({
				message : 'upload complete',
				imageUrl : '/uploads/' + req.file.filename
			})
	});

	app.get('/api/page-data/view-board', async(function(req, res) {
		
		var dataToSent = {
			isUserCollaborator : false,
			isUserOwnerOfBoard : false,
			isUserBookmarkedThisBoard : false,
			isUserInRequestingToBeCollaborator : false,
			isUserCollaboratorRequestRejected : false,
			boardCards : [],
			isUserLoggedIn : false,
			boardCollaborators : [],
			boardCollaboratorsRequest : [],
			boardId : null,
			user : null
		};

		try {

			var user = req.user;
			var boardId = req.query.boardId;
			var board = await(Board.findById(boardId));
			
			if(!board) {

				res
					.status(404)
					.json({
						message : 'Board Not Found'
					});
			}

			var cardsOfThisBoard = await(Card.find({ 
				boardId : boardId,
				deleted : false 
			}));

			dataToSent.boardId = board._id;
			dataToSent.boardCards = cardsOfThisBoard;

			if(user != null) {
				
				dataToSent.user = user;
				
				dataToSent.isUserLoggedIn = true;

				// check if user is collaborators of board
				var anyUserIdInCollaborator = board.collaborators.find(function(collaborator) {
					return collaborator.userId == user._id;
				});

				if(anyUserIdInCollaborator != undefined) {
					dataToSent.isUserCollaborator = true;				
				}

				//check if user is owner of board
				if(board.user.id == user._id) {
					
					dataToSent.isUserOwnerOfBoard = true;
					dataToSent.isUserCollaborator = true;

					dataToSent.boardCollaborators = board.collaborators;
					dataToSent.boardCollaboratorsRequest = board.collaboratorsRequest;
				}

				// check if user is in requesting to be collaborators
				var anyUserIdInRequestCollaborators = board.collaboratorsRequest.find(function(collaborator) {
					return collaborator.userId == user._id;
				});

				if(anyUserIdInRequestCollaborators != undefined) {
					dataToSent.isUserInRequestingToBeCollaborator = true;				
				}

				// check if user collaborator request is rejected
				var anyUserIdInRejectedRequestCollaborators = board.rejectedCollaboratorsRequest.find(function(collaborator) {
					return collaborator.userId == user._id;
				});

				if(anyUserIdInRejectedRequestCollaborators != undefined) {
					dataToSent.isUserCollaboratorRequestRejected = true;				
				}

				// check if user is already bookmarked this board
				var anyUserIdInBookmarkedBy = board.bookmarkedBy.find(function(userIdThatBookmarkedThisBoard) {
					return userIdThatBookmarkedThisBoard == user._id;
				});

				if(anyUserIdInBookmarkedBy != undefined) {
					dataToSent.isUserBookmarkedThisBoard  = true;				
				}
			}

			res
				.status(200)
				.json(dataToSent);

		} catch(error) {

			res
				.status(500)
				.json({
					message : error.toString()
				})
		}
		

	}));
}