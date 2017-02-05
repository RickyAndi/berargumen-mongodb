var Card = require('../models/card');

var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = function(app) {
	
	app.get('/card/:cardId', async(function(req, res) {
		
		var cardId = req.params.cardId;
		var card = await(Card.findById(cardId));
		
		var relatedCard = null
		var relatedCardTitle = null;

		if(card.related.to) {
			relatedCard = await(Card.findById(card.related.to));
			
			if(relatedCard.title.length > 100) {
				relatedCardTitle = relatedCard.title.slice(0, 100) + '.....';
			} else {
				relatedCardTitle = relatedCard.title;
			}
		}

		res.render('card', {
			card : card,
			user : req.user,
			title : 'Lihat Detail Card',
			relatedCardTitle : relatedCardTitle
		});

	}));
}