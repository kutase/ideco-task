var express = require('express'),
	router = express.Router(),

	debug = require('debug'),
	error = debug('router:err'),
	log = debug('router:log'),

	models = require('../models.js'),
	controller = require('../controller.js');

router.get('/', function(req, res) {
	res.sendFile('index.html');
})

router.route('/words')
	.get(function(req, res) {
		controller.getWords(req, res);
	})
	.post(function(req, res) {
		req.checkBody('word', 'Word must be not empty and include only askii symbols.')
			.isWord().isAscii();
		var errors = req.validationErrors();
		if (errors) {
			res.status(400).json(errors);
			return
		}

		controller.addWord(req, res);
	})
	.put(function(req, res) {
		req.checkBody('old_word', 'Word must be not empty and include only askii symbols.')
			.isWord().isAscii();
		req.checkBody('new_word', 'Word must be not empty and include only askii symbols.')
			.isWord().isAscii();

		var errors = req.validationErrors();
		if (errors) {
			res.status(400).json(errors);
			return
		}

		controller.updateWord(req, res);
	})
	.delete(function(req, res) {
		req.checkBody('word', 'Word must be not empty and include only askii symbols.')
			.isWord().isAscii();
		var errors = req.validationErrors();
		if (errors) {
			res.status(400).json(errors);
			return
		}

		controller.delWord(req, res);
	})

module.exports = router;