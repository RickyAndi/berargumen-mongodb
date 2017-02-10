var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var authMiddleware = require('../middlewares/auth');
var Board = require('../models/board');
var mongoose = require('mongoose');

var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = function(app) {

	app.get('/my-boards', ensureLoggedIn('/login'), function(req, res) {
		res.render('myboard', { user : req.user });
	})

	app.get('/board/:boardId', async(function(req, res) {
		
		try {
			
			var board = await(Board.findById(req.params.boardId));

			if(!board) {
				throw new Error('Board tidak ditemukan');
			}

			var isUserBoardOwner = false;
			
			if(req.user) {
				isUserBoardOwner = board.user.id == req.user._id;
			}
			
			res
				.render('viewboard', { 
					user : req.user,
					board : board,
					title : board.title,
					isUserBoardOwner : isUserBoardOwner
				})

		} catch(error) {

			var message = 'Board tidak ditemukan';

			res
				.status(404)
				.render('error-page', {
					message : message,
					title : message
				});

		}
	}))
}