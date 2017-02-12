module.exports = function(req, res, next) {
	
	var schema = {
		'title' : {
			notEmpty: true,
			errorMessage : 'Card harus mempunyai isi'
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