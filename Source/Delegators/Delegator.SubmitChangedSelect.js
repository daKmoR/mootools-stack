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

	/* we use click and change to support shitty browsers */
	Delegator.register(['click', 'change'], 'SubmitChangedSelect', {

		defaults: {
			form: '!form'
		},

		handler: function(event, element, api) {
			lastElement = element.retrieve('GoToChangedSelect::lastElement', element.getElement(':selected'));
			currentElement = element.getElement(':selected');

			if (lastElement.get('value') !== currentElement.get('value')) {
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

				element.store('GoToChangedSelect::lastElement', currentElement);
			}
		}

	});

})();