var debug = require('debug'),
	log = debug('controller:log'),
	error = debug('controller:err'),
	async = require('async'),

	util = require('util'),
	models = require('./models.js');

var errorHandler = function (err) {
	if (err.name == 'SequelizeUniqueConstraintError') {
		var resErrors = [];
		err.errors.forEach(function (item) {
			var obj = {};
			obj[item.path] = {
				message: _.capitalize(item.message),
				value: item.value
			}
			resErrors.push(obj)
		})
		return resErrors;
	} else {
		return err;
	}
}

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
		error('getWeight:', err);
		done && done(err);
	})
}

var getSumWeight = function (words, done) {
	async.map(words, getWeight, function (err, results) {
		if (err) {
			error('getSumWeight:', err);
			done && done({code: 400, error: errorHandler(err)});
		} else {
			var sumWeight = 0;
			results.forEach(function (item) {
				sumWeight += item;
			});
			if (sumWeight) {
				done && done(null, {sumWeight: sumWeight});
			} else {
				done && done(null, {sumWeight: 'Undefined'});
			}
		}
	})
}

exports.getSumWeight = getSumWeight;