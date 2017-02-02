var authMiddleware = require('../middlewares/auth');
var mongoose = require('mongoose');

var Board = require('../models/board');
var User = require('../models/user');
var Card = require('../models/card');

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
	
	app.get('/api/my-boards', authMiddleware, function(req, res) {
		
		var userId = req.user._id;
		var page = req.query.page;

		Board.paginate({ 'user.id': mongoose.Types.ObjectId(userId) }, { page: page, limit: 5 }).then(function(boards) {
			res.json(boards)
		})
	})

	app.get('/api/bookmarked-boards', authMiddleware, function(req, res) {
		
		var userId = req.user._id;
		var page = req.query.page;

		Board.paginate({ 'bookmarkedBy.' : mongoose.Types.ObjectId(userId) }, { page: page, limit: 5 }).then(function(boards) {
			res.json(boards)
		})
	})

	app.get('/api/boards', function(req, res) {

		var page = req.query.page;

		Board.paginate({}, { page: page, limit: 5 }).then(function(boards) {
			res.json(boards)
		})
	})

	app.get('/api/collaborated-boards', authMiddleware, function(req, res) {
		
		var userId = req.user._id;
		var page = req.query.page;

		Board.paginate({ collaborators : { $elemMatch : { userId : mongoose.Types.ObjectId(userId) }}}, { page: page, limit: 5 }).then(function(boards) {
			res.json(boards)
		})
	})

	app.post('/api/board', authMiddleware, function(req, res) {
		
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

		newBoard.save()
			.then(function(newBoard) {
				res.status(200).json(newBoard);
			})
			.catch(function(error) {
				res.status(500).json({ 
					message : 'Error Happen'
				});
			})
	})

	app.get('/api/card/:cardId/catatan', function(req, res) {

		var cardId = req.params.cardId;
		var userId = req.user._id;
		var boardId = req.body.boardId;

		Card.findOne({ _id : cardId, 'creator.id' : userId}).then(function(card) {
			if(!card) {
				res.status(404).json({
					message : 'Card Not Found'
				})
			}
			
			var cardData = {
				catatan : card.content
			}

			res
				.status(200)
				.json(cardData)

		}).catch(function(error) {
			res
				.status(500)
				.json({
					message : error.toString()
				})
		})
	})

	app.post('/api/card/:cardId/update', authMiddleware, function(req, res) {

		var cardId = req.params.cardId;
		var userId = req.user._id;
		var boardId = req.body.boardId;
		var isi = req.body.title;
		var catatan = req.body.content;

		Card.findOneAndUpdate({ _id : cardId, 'creator.id' : userId}, {
			title : isi,
			content : catatan
		}).then(function(card) {
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

		}).catch(function(error) {
			res
				.status(500)
				.json({
					message : error.toString()
				})
		})
	})

	app.post('/api/card/:cardId/delete', authMiddleware, function(req, res) {

		var cardId = req.params.cardId;
		var userId = req.user._id;
		var boardId = req.body.boardId;

		Card.findOneAndUpdate({ _id : cardId, 'creator.id' : userId}, {
			deleted : true
		}).then(function(card) {
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

		}).catch(function(error) {
			res
				.status(500)
				.json({
					message : error.toString()
				})
		})
	})

	app.post('/api/card/:cardId/updatePosition', authMiddleware, function(req, res) {
		
		var cardId = req.params.cardId;
		var userId = req.user._id;
		var boardId = req.body.boardId;

		Card.findOneAndUpdate({ _id : cardId, 'creator.id' : userId}, {
			top : req.body.top,
			left : req.body.left
		}).then(function(card) {
			if(!card) {
				res.status(404).json({
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
			
			res.status(200).json({
				message : 'Card Position Updated'
			})

		}).catch(function(error) {
			res
				.status(500)
				.json({
					message : error.toString()
				})
		})
	})

	app.post('/api/board/:boardId/card', authMiddleware, function(req, res) {
		
		var boardId = req.params.boardId;
		
		Board.findById(boardId)
			.then(function(board) {
				
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
				var cardTop = '100px';
				var cardLeft = '100px';
				var cardId = null;
				var relationType = null;

				if(req.body.related.to != null) {
					cardId = mongoose.Types.ObjectId(req.body.related.to);
					relationType = req.body.related.type; 
				} 

				var newCard = new Card({
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

				newCard.save()
					.then(function(newCard) {
					
						var cardCreatedEventName = boardId + ':card-created';

						io.card.emit(cardCreatedEventName, newCard);

						res
							.status(200)
							.json({
								message : 'Card Created'
							})
					})
					.catch(function(error) {
						console.log(error.toString())
						res
							.status(500)
							.json({
								message : 'Card Created'
							})	
					})
			})
			.catch(function(error) {

				res
					.status(500)
					.json({
						message : 'Card Created'
					})
			})
	})

	app.get('/api/board/:boardId/cards', function(req, res) {
		
		var boardId = req.params.boardId;
		
		Board.findById(boardId)
			.then(function(board) {
				
				if(!board) {
					res.status(404).json({
						message : 'Board Not Found'
					})
				}

				Card.find({ 
					boardId : boardId,
					deleted : false 
				}).then(function(cards) {
					
					res
						.status(200)
						.json(cards)

				}).catch(function(error) {
					res
						.status(500)
						.json({
							message : 'Error Happen'
						})
				})
			})
			.catch(function(error) {

				res.status(500).json({
					message : 'Error Happen'
				})
			})
	})

	app.get('/api/board/:boardId', function(req, res) {

		var boardId = req.params.boardId;

		Board.findById(boardId)
			.then(function(board) {
				res
					.status(200)
					.json(board)
			})
			.catch(function(error) {
				res
					.status(500)
					.json({
						message : 'Error Happen'
					})
			})

	})
}