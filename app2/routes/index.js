var express = require('express'),
	router = express.Router(),

	debug = require('debug'),
	error = debug('router:err'),
	log = debug('router:log'),

	models = require('../models.js'),
	controller = require('../controller.js');

router.route('/text')
	.post(function(req, res) {
		req.checkBody('text', 'Text must not be empty and must include only ascii symbols.')
			.notEmpty().isAscii();
		var errors = req.validationErrors();
		if (errors) {
			res.status(400).json({status: errors});
			return
		}

		var text = req.body.text;
		var words = text.replace(/\s+/g, ' ').replace(/(\.|\,)/g, '').split(' '); // '.' and ',' -> ''
		controller.getSumWeight(words, function (err, data) {
			if (err) {
				res.status(err.code).json({status: err.error});
			} else {
				res.status(200).json(data);
			}
		});
	})

module.exports = router;