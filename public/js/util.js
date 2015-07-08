var util = { 
	extract: function(form) {
		if (typeof form == "object") {
			var formData = ko.mapping.toJS(form,{
			    'ignore': ["default","error"]
			});
			// console.log("util.extract@formData:", formData);
			return formData;
		} else {
			console.log("util.extract@err: invalid data type");
			return null;
		}
	},
	insert: function(data, form) {
		if (typeof data == "object" && typeof form == "object"){
			ko.mapping.fromJS(data,{},form);
			// console.log("util.insert@form:", ko.toJS(form));
		} else {
			console.log("util.insert@err: invalid data type");
		}
	},
	clean: function(form) {
		if (typeof form == "object" && typeof form.default == "object") {
			ko.mapping.fromJS(form.default,{},form);
			// console.log("util.clean@form:", ko.toJS(form));
		} else {
			console.log("util.clean@err: invalid data type");
		}
	},
	refreshErrors: function(form) {
		if (typeof form == "object") {
			for (var errField in form) {
				if (typeof form[errField] == "function") {
					form[errField]([]);
				}				
			}
		}
	},
	getParentPath: function() {
		return pager.activePage$().currentParentPage().path$()();
	},
	rh: {
		set: function(header,value) {
			if (typeof header == "string" && typeof value == "string") {
				$.ajaxSetup({
					beforeSend: function (xhr) {
						xhr.setRequestHeader(header, value); 
					}
				});
			} else {
				console.log("util.requestHeader.set@err: invalid data type");
			}
		},
		delete: function(header) {
			if (typeof header == "string") {
				$.ajaxSetup({
					beforeSend: function (xhr) {
						xhr.setRequestHeader(header, ""); 
					}
				});
			} else {
				console.log("util.requestHeader.delete@err: invalid data type");
			}
		}
	},
	lc : {
		get: function (item) {
			return window.localStorage.getItem(item);
		},
		set: function (item,value) {
			window.localStorage.setItem(item, value);
		},
		delete: function (item) {
			window.localStorage.removeItem(item);
		},
	}
};