var express = require('express'),
	router = express.Router(),

	debug = require('debug'),
	error = debug('router:err'),
	log = debug('router:log'),

	models = require('../models.js'),
	controller = require('../controller.js');

// router.get('/', function(req, res) {
// 	res.sendFile('index.html');
// })

router.route('/text')
	.post(function(req, res) {
		req.checkBody('text', 'Text must not be empty and include only askii symbols.')
			.notEmpty().isAscii();
		var errors = req.validationErrors();
		if (errors) {
			res.status(400).json(errors);
			return
		}

		controller.getSumWeight(req, res);
	})

module.exports = router;