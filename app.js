var server = require('./server/server');
var mongoose = require('mongoose');

var db = mongoose.connection;

mongoose.connect('mongodb://localhost/berargumen');

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
	server.listen(3000, function() {
		console.log('App Listen On Port 3000')
	});
});
