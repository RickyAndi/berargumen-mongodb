var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var tagSchema = new Schema({
	name : String,
	boardCount : {
		type : Number
	}
});

module.exports = Mongoose.model('Tag', tagSchema);