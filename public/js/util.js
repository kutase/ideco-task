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
		} else {
			console.log("util.insert@err: invalid data type");
		}
	},
	clean: function(form) {
		if (typeof form == "object" && typeof form.default == "object") {
			ko.mapping.fromJS(form.default,{},form);
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
};