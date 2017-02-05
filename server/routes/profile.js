var User = require('../models/user');
var mongoose = require('mongoose');

var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = function(app) {
	app.get('/profile/:userId', async(function(req, res) {
		
		var userId = req.params.userId;

		var user = await(User.findById(userId));

		res.render('profile', {
			profileUser : user,
			user : req.user
		});
	}))

	app.get('/my-profile',  ensureLoggedIn('/login'), async(function(req, res) {
		
		try {

			var currentUser = await(User.findById(req.user._id));

			res.render('my-profile', {
				currentUser : currentUser,
				title : 'Profil Saya',
				user : req.user
			});
		
		} catch(error) {
			
			res
				.status(500)
				.json({
					message : error.toString()
				})
		}
	}));
}