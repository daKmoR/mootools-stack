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

	Delegator.register('change', 'GoToChangedSelect', {

		handler: function(event, element, api) {
			// IE8 gets this event anyway? so exit
			if (event.type == 'click') {
				return;
			}

			currentElement = element.getElement(':selected');
			url = currentElement.get('value');
			if (url.indexOf('http') === -1 || url.indexOf('http') > 0) {
				url = location.protocol + '//' + location.host + '/' + url;
			}

			if (url) {
				newWindow = currentElement.get('data-GoToChangedSelect-target');
				if (newWindow === 'true') {
					window.open(url);
				} else {
					location = url;
				}
			}

		}

	});

})();