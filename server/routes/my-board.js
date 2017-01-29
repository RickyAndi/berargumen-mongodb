var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var authMiddleware = require('../middlewares/auth');
var Board = require('../models/board');
var mongoose = require('mongoose');

module.exports = function(app) {

	app.get('/my-boards', ensureLoggedIn('/login'), function(req, res) {
		res.render('myboard', { user : req.user });
	})

	app.get('/board/:boardId', function(req, res) {
		Board.findById(req.params.boardId).then(function(board) {
			res.render('viewboard', { 
				user : req.user,
				board : board,
				title : 'Lihat Board' 
			})
		})
	})
}