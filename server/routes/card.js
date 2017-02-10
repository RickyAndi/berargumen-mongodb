var Card = require('../models/card');

var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = function(app) {
	
	app.get('/card/:cardId', async(function(req, res) {
		
		try {

			var cardId = req.params.cardId;
			var card = await(Card.findById(cardId));
			
			if(!card) {
				throw new Error();
			}

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

		} catch(error) {

			var message = 'Card tidak ditemukan';

			res
				.status(404)
				.render('error-page', {
					message : message,
					title : message
				})
		}
	
	}));

}