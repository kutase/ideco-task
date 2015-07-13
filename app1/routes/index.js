var express = require('express'),
	router = express.Router(),

	debug = require('debug'),
	error = debug('router:err'),
	log = debug('router:log'),

	models = require('../models.js'),
	controller = require('../controller.js');

const msgNEisAlphanum = 'Word must not be empty and must include only alphanumeric symbols.';

router.route('/words')
	.get(function(req, res) {
		controller.getWords(function (err, data) {
			if (err) {
				res.status(err.code).json({status: err.error});
			} else {
				res.status(200).json(data);
			}
		});
	})
	.post(function(req, res) {
		req.checkBody('word', msgNEisAlphanum)
			.isWord().isAlphanumeric();
		var errors = req.validationErrors();
		if (errors) {
			res.status(400).json({status: errors});
			return
		}

		var word = req.body.word;
		controller.addWord(word, function (err, data) {
			if (err) {
				res.status(err.code).json({status: err.error});
			} else {
				res.status(200).json(data);
			}	
		});
	})
	.put(function(req, res) {
		req.checkBody('oldWord', msgNEisAlphanum)
			.isWord().isAlphanumeric();
		req.checkBody('newWord', msgNEisAlphanum)
			.isWord().isAlphanumeric();

		var errors = req.validationErrors();
		if (errors) {
			res.status(400).json({status: errors});
			return
		}

		var props = {
			oldWord: req.body.oldWord,
			newWord: req.body.newWord
		};
		controller.updateWord(props, function (err, data) {
			if (err) {
				res.status(err.code).json({status: err.error});
			} else {
				res.status(200).json(data);
			}			
		});
	})
	.delete(function(req, res) {
		req.checkBody('word', msgNEisAlphanum)
			.isWord().isAlphanumeric();
		var errors = req.validationErrors();
		if (errors) {
			res.status(400).json({status: errors});
			return
		}

		var word = req.body.word;
		controller.delWord(word, function (err, data) {
			if (err) {
				res.status(err.code).json({status: err.error});
			} else {
				res.status(200).json(data);
			}	
		});
	})

module.exports = router;