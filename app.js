var app = require('./server/app');
var server = require('http').Server(app);
var mongoose = require('mongoose');
var io = require('./server/socket')(server);
var db = mongoose.connection;

var sockets = {
	card : io.of('/card')
}

// require route
var authRoute = require('./server/routes/auth');
var indexRoute = require('./server/routes/index');
var myBoardRoute = require('./server/routes/my-board');
var apiRoute = require('./server/routes/api');
var profileRoute = require('./server/routes/profile');
var cardRoute = require('./server/routes/card');
var boardRoute = require('./server/routes/board');

// route
indexRoute(app, sockets);
authRoute(app, sockets);
myBoardRoute(app, sockets);
apiRoute(app, sockets);
profileRoute(app);
cardRoute(app);
boardRoute(app)

mongoose.connect('mongodb://localhost/berargumen');

db.on('error', function() {
	console.error.bind(console, 'connection error:');
	db.close();
});

server.on('error', function (e) {
	db.close();
});

db.once('open', function() {
	
	server.listen(3000, function() {
		console.log('App Listen On Port 3000')
	});
});
