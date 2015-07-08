process.env.DEBUG = 'main:*,router:*,models:*,controller:*'; // Debug mode

var express = require('express'),
	app = express(),
	http = require('http').Server(app),
	routes = require('./routes/index.js'),
	expressValidator = require('express-validator'),
	bodyParser = require('body-parser'),

	debug = require('debug'),
	error = debug('main:err'),
	log = debug('main:log'),

	models = require('./models.js');

app.use(bodyParser());
app.use(expressValidator({
	customValidators: {
		isWord: function (val) {
			return !/\s+/.test(val);
		}
	}
}));

app.use(express.static('../public'));
app.use('/', routes);

http.listen(3000, function(){
	log("listening on *:3000");
});