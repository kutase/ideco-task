var crypto = require('crypto'),
	debug = require('debug'),
	log = debug('controller:log'),
	error = debug('controller:err'),
	async = require('async'),

	util = require('util'),
	models = require('./models.js');

var getWeight = function (word, done) {
	models.Words.findOne({where: {word: word}})
	.then(function (record) {
		if (record){
			done && done(null, record.weight);
		} else {
			// err = 'Record does not exists.'
			// done && done(err);
			done && done(null, 0);
		}
	})
	.catch(function (err) {
		error(err);
		done && done(err);
	})
}

var getSumWeight = function (req, res, done) {
	var text = req.body.text;
	var words = text.replace(/\s+/g, ' ').replace(/(\.|\,)/g, '').split(' ');
	async.map(words, getWeight, function (err, results) {
		if (err) {
			error(err);
			res.status(400).json({'status': 'Words table is empty.'});
		} else {
			var sumWeight = 0;
			results.forEach(function (item) {
				sumWeight += item;
			});
			res.status(200).json({sumWeight: sumWeight});
		}
	})
}

exports.getSumWeight = getSumWeight;