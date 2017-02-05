var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var userSchema = new Schema({
	facebookId : String,
	name : String,
	profilePicUrl : String,
	gender : String,
	email : String,
	addedOn : { type: Date, default: Date.now },
	numberOfBoards : {
		type : Number
	},
	numberOfCards : {
		type : Number
	}
})

module.exports = Mongoose.model('User', userSchema);