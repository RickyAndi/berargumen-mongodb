var User = require('../models/user');
var mongoose = require('mongoose');


module.exports = function(app) {
	app.get('/profile/:userId', function(req, res) {
		
		var userId = mongoose.Types.ObjectId(req.user._id);

		User.find(userId).then(function(user) {
			res.render('profile', {
				user : user
			});
		})
	})
}