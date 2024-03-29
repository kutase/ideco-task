process.env.DEBUG = 'main:*,router:*,models:*,controller:*'; // Debug mode

var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	expressValidator = require('express-validator'),
	bodyParser = require('body-parser'),
	_ = require('lodash'),

	routesAppOne = require('./app1/routes/index.js'),
	routesAppTwo = require('./app2/routes/index.js'),
	models = require('./app1/models'),

	debug = require('debug'),
	error = debug('main:err'),
	log = debug('main:log');

app.use(bodyParser());
app.use(expressValidator({
	customValidators: {
		isWord: function (val) {
			return !/\s+/.test(val);
		}
	},
	errorFormatter: function(param, msg, value) {
		var obj = {};
		obj[param] = {
			message: _.capitalize(msg),
			value: value
		}
		return obj;
	}
}));

app.use(express.static('./public'));

app.get('/', function(req, res) {
	res.sendFile('index.html');
})

app.use('/', routesAppOne);
app.use('/', routesAppTwo);

models.sequelize.sync()
.then(function () {
	log('Database was successfully synchronized.')
})

http.listen(3000, function(){
	log("listening on *:3000");
});