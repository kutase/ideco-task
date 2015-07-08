var	form = {
	addWord: {
		word: ko.observable(""),
		error: {
			word: ko.observableArray([]),
		},
		default: {
			word: ""
		}
	},
}

var app = {
	wordsArr: ko.observableArray([]),
	wordEditable: ko.observable(false),
	user: {
		email: ko.observable(""),
		characters: ko.observableArray([]),
		chosenCharacter: ko.observable(null),
		default: {
			email: "",
			characters: [],
			chosenCharacter: null,
		}
	},
	words: {
		getList: function () {
			$.get('/words')
			.done(function(data) {
				console.log("words@data:",data);
				app.wordsArr(_.map(data.words,function(item){
					var word = {};
					util.insert(item,word);
					return word;
				}));
			})
			.fail(function(xhr, textStatus, errorThrown) {
				var err = JSON.parse(xhr.responseText);
				console.log("words.get@err:",err);
			});
		},
		addWord: function(){
			var formData = util.extract(form.addWord);
			console.log(formData);
			util.refreshErrors(form.addWord.error);
			$.post('/words',formData)
			.done(function(data) {
				console.log("addWord@success:",data);
				var word = {};
				util.insert(data,word);
				app.wordsArr.unshift(word);
				util.clean(form.addWord);
				console.log(app.wordsArr());
			})
			.fail(function(xhr, textStatus, errorThrown) {
				var err = JSON.parse(xhr.responseText);
				console.log("addWord@err:",err);
				util.insert(err,form.addWord.error);
			});
		},
		editWord: function(word){
			if (!app.wordEditable()) {
				app.wordEditable(true);
			} else {
				app.wordEditable(false);
			}
		},
		delWord: function(word){
			if (typeof(word)!='string') {
				var word = word();
			}
			$.delete('/words',{word: word})
			.done(function(status) {
				console.log("delWord@success:",status);
				app.wordsArr.remove(function(item){return item.word() == word});
			})
			.fail(function(xhr, textStatus, errorThrown) {
				var err = JSON.parse(xhr.responseText);
				console.log("delWord@err:",err);
			});
		},
	},
}

jQuery.each(["put", "delete","get","post"], function(i, method) {
  jQuery[method] = function( url, data, callback, type ) {
	if (jQuery.isFunction(data)) {
		type = type || callback;
		callback = data;
		data = undefined;
	}

	return jQuery.ajax({
		url: url,
		type: method,
		dataType: type,
		data: data,
		success: callback
	});
  };
});

$(function(){
	app.words.getList();
	ko.applyBindings(app,$("html")[0]);
});