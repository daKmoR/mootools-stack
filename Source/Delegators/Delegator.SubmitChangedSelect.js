/*
---
description: Submits a Select only ONCE if the value changed
provides: [Delegator.SubmitChangedSelect]
requires: [Behavior/Delegator, Core/Element]
script: Delegator.SubmitChangedSelect.js
name: Delegator.SubmitChangedSelect
...
*/

(function(){

	Delegator.register('change', 'SubmitChangedSelect', {

		defaults: {
			form: '!form'
		},

		handler: function(event, element, api) {
			// IE8 gets this event anyway? so exit
			if (event.type == 'click') {
				return;
			}

			currentElement = element.getElement(':selected');
			var formSelector = api.getAs(String, 'form');
			var form = element.getElement(formSelector);
			if (!form) {
				api.fail('Cannot find target form: "' +formSelector+ '" for SubmitChangedSelect delegator.');
			}
			var request = form.retrieve('form.request');
			if (request) {
				request.send();
			} else {
				form.submit();
			}
		}

	});

})();