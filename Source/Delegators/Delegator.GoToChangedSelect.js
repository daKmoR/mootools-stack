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

	/* we use click and change to support shitty browsers */
	Delegator.register(['click', 'change'], 'GoToChangedSelect', {

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
						location.pathname = url;
					}
				}
				element.store('GoToChangedSelect::lastElement', currentElement);
			}
		}

	});

})();