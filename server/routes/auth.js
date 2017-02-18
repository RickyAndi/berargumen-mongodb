var passport = require('../passport');
var User = require('../models/user');

module.exports = function(app) {
	
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));

	app.get('/auth/facebook/callback', passport.authenticate('facebook', { 
			failureRedirect: '/login' }),
	  	function(req, res) {
	  		res.redirect('/');
		},
		function(err,req,res,next) {
		    if(err) {
				res
	            	.status(400)
	            	.render('error-page', {
			    		message : 'Ada kesalahan saat login',
			    		title : 'Login Error'
		    		})
	        }
		}
	);
}