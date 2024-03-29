var Sequelize = require('sequelize'),
	sqlite3 = require('sqlite3').verbose(),
	_ = require('lodash'),

	debug = require('debug'),
	log = debug('models:log'),
	error = debug('models:err'),

	controller = require('./controller.js');

var sequelize = new Sequelize('', '', '', { // DB install
	host: 'localhost',
	dialect: 'sqlite',

	// SQLite only
	storage: './db.sqlite3',
	logging: false
});

var serialize = function (object, fields) {
  var newObject = _.pick(object, fields);
  return newObject;
}

var arrToJson = function(arr, serialize_list) { // [{Sequelize obj}] -> [{object}]
	var res = _.map(arr, function (e) {
		if (serialize_list) {
			return exports.serialize(e.toJSON(), serialize_list);
		} else {
			return e.toJSON();
		}
	})
	return res;
}

Words = sequelize.define('Words', { // Word model
	word: {
		type: Sequelize.STRING(128),
		allowNull: false,
		unique: true,
	},
	weight: {
		type: Sequelize.INTEGER,
		allowNull: false
	}
}, {
	hooks: {
		beforeValidate: function (table, options) { // Weight auto defenition
			table.weight = controller.getIntFromWord(table.word);
			return sequelize.Promise.resolve(table);
		},
		beforeUpdate: function (table, options) {
			table.weight = controller.getIntFromWord(table.word);
			return sequelize.Promise.resolve(table);
		}
	}
})

exports.arrToJson = arrToJson;
exports.Words = Words;
exports.serialize = serialize;
exports.sequelize = sequelize;