var socket = require('socket.io');

module.exports = function(server) {
	var io = socket(server);

	return io;
}