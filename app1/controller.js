var crypto = require('crypto'),
	debug = require('debug'),
	log = debug('controller:log'),
	error = debug('controller:err'),
	_ = require('lodash'),

	util = require('util'),
	models = require('./models.js');

var getIntFromWord = function (str) { // 'str' -> int
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

var getWords = function (done) {
	models.Words.findAll({order:[['id','DESC']]})
	.then(function(words) {
		if (!words.length) {
			error('getWords:', 'Words table is empty.');
			done({code: 403, error: {message: 'Words table is empty.'}});
		} else {
			var words = models.arrToJson(words, ['word', 'weight']);
			done(null, {words: words});
		}
	})
	.catch(function(err) {
		error('getWords:', err);
		done({code: 400, status: err});
	})
}

var addWord = function (word, done) {
	models.Words.create({word: word})
	.then(function(record){
		log('addWord@success:', record.toJSON());
		var record = models.serialize(record, ['word', 'weight']);
		done(null, record);
	})
	.catch(function(err) {
		error('addWord:', err);
		done({code: 400, error: errorHandler(err)});
	})
}

var updateWord = function (props, done) {
	var oldWord = props.oldWord;
	var newWord = props.newWord;

	models.Words.findOne({where: {word: oldWord}})
	.then(function (record) {
		record.updateAttributes({word: newWord}, {fields: ['word', 'weight']})
		.then(function(updated) {
			var updated = models.serialize(updated, ['word', 'weight']);
			done(null, updated);
		})
		.catch(function(err){
			error('updateWord:', err);
			done({code: 400, error: errorHandler(err)});
		})
	})
	.catch(function(err) {
		error('updateWord:', err);
		done({code: 400, error: errorHandler(err)});
	})
}

var delWord = function (word, done) {
	models.Words.findOne({where: {word: word}})
	.then(function (record) {
		if (!record) {
			var err = "Word's record does not exists.";
			error('delWord:', err);
			done({code: 400, error: {message: err}});
		} else {
			record.destroy()
			.then(function() {
				done(null, {status: util.format("Word '%s' was successfuly deleted.", record.toJSON().word)})
			})
		}
	})
	.catch(function(err) {
		error('delWord:', err);
		done({code: 400, error: err});
	})
}

exports.getIntFromWord = getIntFromWord;
exports.getWords = getWords;
exports.addWord = addWord;
exports.updateWord = updateWord;
exports.delWord = delWord;