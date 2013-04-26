/*
---
description: Goes to an Url saved in an option
provides: [Delegator.GoToChangedSelect]
requires: [Behavior/Delegator, Core/Element]
script: Delegator.GoToChangedSelect.js
name: Delegator.GoToChangedSelect
...
*/

(function(){

	Delegator.register('click', 'GoToChangedSelect', {

		handler: function(event, element, api) {
			lastElement = element.retrieve('GoToChangedSelect::lastElement', element.getElement(':selected'));
			currentElement = element.getElement(':selected');

			if (lastElement.get('value') !== currentElement.get('value')) {
				url = currentElement.get('value');
				if (url) {
					newWindow = currentElement.get('data-GoToChangedSelect-target');
					if (newWindow === 'true') {
						window.open(url);
					} else {
						window.location = url;
					}
				}
				element.store('GoToChangedSelect::lastElement', currentElement);
			}
		}

	});

})();