var User = require('../models/user');
var mongoose = require('mongoose');

var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = function(app) {
	app.get('/profile/:userId', async(function(req, res) {
		
		var userId = req.params.userId;

		var user = await(User.findById(userId));

		res.render('profile', {
			user : user
		});
	}))
}