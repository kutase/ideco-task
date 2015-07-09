var crypto = require('crypto'),
	debug = require('debug'),
	log = debug('controller:log'),
	error = debug('controller:err'),
	_ = require('lodash'),

	util = require('util'),
	models = require('./models.js');

var getIntFromWord = function (str) {
	const divider = Math.pow(10, 21);
	var md5 = crypto.createHash('md5').update(str);
	var res = parseInt(md5.digest('hex'),16)/divider+'';
	return parseInt(res.slice(0,9));
}

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

var getWords = function (req, res) {
	models.Words.findAll({order:[['id','DESC']]}) // Выборка SQL в обратном порядке
	.then(function(words) {
		if (!words.length) {
			error('getWords:', 'Words table is empty.');
			res.status(403).json({'status': {message: 'Words table is empty.'}});
		} else {
			var words = models.arrToJson(words, ['word', 'weight']);
			res.json({'words': words});
		}
	})
	.catch(function(err) {
		error('getWords:',err);
		res.status(400).json({'status': err});
	})
}

var addWord = function (req, res) {
	var word = req.body.word;
	models.Words.create({word: word})
	.then(function(record){
		log('addWord@success:',record.toJSON());
		var record = models.serialize(record, ['word', 'weight']);
		res.status(200).json(record);
	})
	.catch(function(err) {
		error('addWord:',err);
		res.status(400).json({'status': errorHandler(err)});
	})
}

var updateWord = function (req, res) {
	var oldWord = req.body.oldWord;
	var newWord = req.body.newWord;

	models.Words.findOne({where: {word: oldWord}})
	.then(function (record) {
		record.updateAttributes({word: newWord}, {fields: ['word', 'weight']})
		.then(function(updated) {
			var updated = models.serialize(updated, ['word', 'weight']);
			res.status(200).json(updated);
		})
		.catch(function(err){
			error('updateWord:',err);
			res.status(400).json({'status': errorHandler(err)});
		})
	})
	.catch(function(err) {
		error('updateWord:',err);
		res.status(400).json({'status': errorHandler(err)});
	})
}

var delWord = function (req, res) {
	var word = req.body.word;

	models.Words.findOne({where: {word: word}})
	.then(function (record) {
		if (!record) {
			var err = "Word's record does not exists.";
			error('delWord:',err);
			res.status(400).json({'status': {message: err}});
		} else {
			record.destroy()
			.then(function() {
				res.status(200)
				.json({status: util.format("Word '%s' was successful delited.", record.toJSON().word)})
			})
		}
	})
	.catch(function(err) {
		error('delWord:',err);
		res.status(400).json({'status': err});
	})
}

exports.getIntFromWord = getIntFromWord;
exports.getWords = getWords;
exports.addWord = addWord;
exports.updateWord = updateWord;
exports.delWord = delWord;