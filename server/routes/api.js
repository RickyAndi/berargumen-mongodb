var authMiddleware = require('../middlewares/auth');
var mongoose = require('mongoose');

var Board = require('../models/board');
var User = require('../models/user');
var Card = require('../models/card');

var cardSocket = require('../socket').card;

module.exports = function(app) {

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
				console.log(error);
				res.status(500).json({ 
					message : 'Error Happen'
				});
			})
	})

	app.post('/api/board/:boardId/card', authMiddleware, function(req, res) {
		
		var boardId = req.params.boardId;
		
		Board.find(boardId)
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
				var cardTop = req.body.top;
				var cardLeft = req.body.left;
				var cardId = null;

				if(req.body.relatedTo) {
					var cardId = mongoose.Types.ObjectId(req.body.relatedTo);
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
					relatedTo : cardId
				})

				newCard.save().then(function(newCard) {
					cardSocket.emit('card-created', newCard);

					res
						.status(200)
						.json({
							message : 'Card Created'
						})
				})
			})
			.catch(function(error) {

			})
	})

	app.get('/api/board/:boardId/cards', function(req, res) {
		
		var boardId = req.params.boardId;
		
		Board.find(boardId)
			.then(function(board) {
				
				if(!board) {
					res.status(404).json({
						message : 'Board Not Found'
					})
				}

				Card.find({ 
					boardId : mongoose.Types.ObjectId(req.params.boardId) 
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