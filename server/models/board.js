var Mongoose = require('mongoose');
var Schema = Mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

var boardSchema = new Schema({
	user : {
		id : { type : Schema.Types.ObjectId, ref : 'User' },
		name : String,
	},
	title : String,
	description : String,
	updated : { type: Date, default: Date.now },
	tags : [String],
	collaborators : [
		{
			userId : { 
				type : Schema.Types.ObjectId, 
				ref : 'User' 
			},
			name : String,
			profilePic : String	
		}
	],
	bookmarkedBy : [{
		type : Schema.Types.ObjectId, 
		ref : 'User'
	}]
});

boardSchema.plugin(mongoosePaginate);

module.exports = Mongoose.model('Board', boardSchema);