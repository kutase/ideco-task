var express = require('express'),
	router = express.Router(),

	debug = require('debug'),
	error = debug('router:err'),
	log = debug('router:log'),

	models = require('../models.js'),
	controller = require('../controller.js');

var msgNEisAcii = 'Word must not be empty and must include only askii symbols.';

router.get('/', function(req, res) {
	res.sendFile('index.html');
})

router.route('/words')
	.get(function(req, res) {
		controller.getWords(req, res);
	})
	.post(function(req, res) {
		req.checkBody('word', msgNEisAcii)
			.isWord().isAscii();
		var errors = req.validationErrors();
		if (errors) {
			res.status(400).json({status: errors});
			return
		}

		controller.addWord(req, res);
	})
	.put(function(req, res) {
		req.checkBody('oldWord', msgNEisAcii)
			.isWord().isAscii();
		req.checkBody('newWord', msgNEisAcii)
			.isWord().isAscii();

		var errors = req.validationErrors();
		if (errors) {
			res.status(400).json({status: errors});
			return
		}

		controller.updateWord(req, res);
	})
	.delete(function(req, res) {
		req.checkBody('word', msgNEisAcii)
			.isWord().isAscii();
		var errors = req.validationErrors();
		if (errors) {
			res.status(400).json({status: errors});
			return
		}

		controller.delWord(req, res);
	})

module.exports = router;