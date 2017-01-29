var passport = require( 'passport' );
var facebookStrategy = require( 'passport-facebook' ).Strategy;
var config = require('./passport-config');
var User = require('./models/user');

var callback = function(accessToken, refreshToken, profile, cb) {
	
	var userData = {
		facebookId : profile.id,
		name : profile.displayName,
		gender : profile.gender,
		profilePicUrl : profile.photos[0].value,
		email : profile.emails[0].value
	}

	process.nextTick(function() {
		User.findOne({ email : userData.email })
			.then(function(user) {
				if(!user) {
					
					var newUser = new User(userData)

					newUser.save().then(function(newUser) {
						return cb(null, newUser)
					})

				} else {
					return cb(null, user);
				}
			})
			.catch(function(error) {
				return cb(error);
			})
	})
}

passport.use(new facebookStrategy(config['facebook'], callback));

passport.serializeUser(function(user, cb) {
	cb(null, user);
});

passport.deserializeUser(function(user, cb) {
	cb(null, user);
});

module.exports = passport;