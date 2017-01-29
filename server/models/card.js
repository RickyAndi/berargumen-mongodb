var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;

var cardSchema = new Schema({
	creator : {
		id : { type : Schema.Types.ObjectId, ref : 'User' },
		name : String 
	},
	title : String,
	content : String,
	type : String,
	top : String,
	left : String,
	updated : { type: Date, default: Date.now },
	relatedTo : { type : Schema.Types.ObjectId, ref : 'Card' },
	boardId : { type : Schema.Types.ObjectId, ref : 'Board' }
});

module.exports = Mongoose.model('Card', cardSchema);