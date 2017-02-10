var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedOut = require('connect-ensure-login').ensureLoggedOut;

module.exports = function(app) {
	
	app.get('/', function(req, res) {
		res.render('index', { 
			title: 'Berargumen', 
			user : req.user 
		})
	});
	
	app.get('/login', ensureLoggedOut('/'), function(req, res) {
		res.render('login', { title : 'Masuk'})
	})

	app.get('/logout', ensureLoggedIn('/login'), function(req, res){
		req.logout();
	  	res.redirect('/');
	});
	
}