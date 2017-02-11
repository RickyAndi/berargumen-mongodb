module.exports = function(app) {
	
	app.get('/tag/board', function(req, res) {
		
		var tag = req.query.tag;

		res.render('board-by-tag', {
			tag : tag,
			title : 'Tag : ' + tag,
			user : req.user
		});

	});

}