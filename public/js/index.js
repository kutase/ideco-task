var navbarSelect = ko.observable(null);

var	form = {
	addWord: {
		word: ko.observable(""),
		error: {
			word: ko.observable(null),
		},
		default: {
			word: ""
		}
	},
	sendText: {
		error: {
			text: ko.observable(null)
		}
	}
}

var app = {
	wordsArr: ko.observableArray([]),
	wordEditable: ko.observable(null),
	editedWord: ko.observable(null),
	text: {
		currentText: ko.observable(""),
		textWeight: ko.observable(null),
		hasWeight: ko.observable(false),
		send: function(){
			var text = app.text.currentText;
			if (text()) {
				console.log("app.text.send@message:",text());
				form.sendText.error.text(null);
				$.post('/text',{text: text()})
				.done(function(data) {
					console.log("text.send@success:",data);
					app.text.textWeight(data.sumWeight);
					app.text.hasWeight(true);
					app.text.currentText("");
				})
				.fail(function(xhr, textStatus, errorThrown) {
					var err = JSON.parse(xhr.responseText);
					console.log("text.send@err:",err);
					form.sendText.error.text(err.status[0].text);
					// util.insert(err,form.addWord.error);
				});  
			} else {
				console.log("text.send@err: Text is blank.");
				form.sendText.error.text({message: 'Field must not be blank.'});
			}
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
			form.addWord.error.word(null);
			$.post('/words',formData)
			.done(function(data) {
				console.log("addWord@success:",data);
				var word = {};
				util.insert(data,word);
				app.wordsArr.unshift(word);
				util.clean(form.addWord);
				form.addWord.error.word(null);
				console.log(app.wordsArr());
			})
			.fail(function(xhr, textStatus, errorThrown) {
				var err = JSON.parse(xhr.responseText);
				console.log("addWord@err:",err);
				form.addWord.error.word(err.status[0].word);
				// util.insert(err.status,form.addWord.error);
			});
		},
		editWord: function(val){
			console.log(app.wordEditable());
			$.put('/words',{oldWord: app.wordEditable(), newWord: app.editedWord()})
			.done(function(data) {
				console.log("editWord@success:",data);
				val.word(data.word);
				val.weight(data.weight);
				app.wordEditable(null);
				app.editedWord(null);
			})
			.fail(function(xhr, textStatus, errorThrown) {
				var err = JSON.parse(xhr.responseText);
				console.log("editWord@err:",err);
				val.word(app.wordEditable());
			});
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
	pager.Href.hash = '#!/';
	pager.extendWithPage(app);

	app.words.getList();
	ko.applyBindings(app,$("html")[0]);

	pager.start();
	if (window.location.href == window.location.origin+'/') {
		window.location.href = '/#!/app1';
		// navbarSelect(1);
	}

	pager.onBindingError.add(function(event) {
		if(window.console && window.console.error) {
			window.console.error(event);
		}
	});
});