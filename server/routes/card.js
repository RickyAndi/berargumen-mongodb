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
			var relatedToSubReasonConnector  = null;

			if(card.related.to) {
				relatedCard = await(Card.findById(card.related.to));
				
				if(relatedCard.type == 'sub-reason-cards-connector') {
					
					relatedToSubReasonConnector = await(Card.findById(relatedCard.related.to));

					if(relatedToSubReasonConnector.title) {
						if(relatedToSubReasonConnector.title.length > 100) {
							relatedCardTitle = relatedToSubReasonConnector.title.slice(0, 100) + '.....';
						} else {
							relatedCardTitle = relatedToSubReasonConnector.title;
						}
					}

				} else {
					if(relatedCard.title) {
						if(relatedCard.title.length > 100) {
							relatedCardTitle = relatedCard.title.slice(0, 100) + '.....';
						} else {
							relatedCardTitle = relatedCard.title;
						}
					}
				}
			}

			res.render('card', {
				card : card,
				user : req.user,
				title : 'Lihat Detail Card',
				relatedCardTitle : relatedCardTitle,
				relatedToSubReasonConnector : relatedToSubReasonConnector
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