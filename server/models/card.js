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
	related : {
		to : { 
			type : Schema.Types.ObjectId, 
			ref : 'Card' 
		},
		type : {
			type : String
		}  
	},
	boardId : { type : Schema.Types.ObjectId, ref : 'Board' },
	deleted : {
		type : Boolean,
		default : false
	}
});

module.exports = Mongoose.model('Card', cardSchema);