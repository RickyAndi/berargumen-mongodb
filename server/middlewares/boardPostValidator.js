var util = require('util');

module.exports = function(req, res, next) {
	
	var schema = {
		'title' : {
			notEmpty: true,
			errorMessage : 'Board harus mempunyai judul'
		},
		'description': {
	    	notEmpty: true,
	    	errorMessage: 'Board harus mempunyai deskripsi'
	  	},
	  	'tags': {
	  		notEmpty: true,
	  		errorMessage: 'Board Harus Mempunyai Tags'	
	  	}
	};

	req.checkBody(schema);

	req.getValidationResult().then(function(result) {
		if (!result.isEmpty()) {
		    
		    return res
		    	.status(400)
		    	.json({
		    		errorType : 'validation error',
		    		message : 'There have been validation errors',
		    		errors : result.array() 
		    	});
		}

		return next();
	})
}