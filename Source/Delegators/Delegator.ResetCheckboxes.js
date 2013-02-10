/*
---
description: print the document
provides: [Delegator.ResetCheckboxes]
requires: [Behavior/Delegator, Core/Element]
script: Delegator.ResetCheckboxes.js
name: Delegator.ResetCheckboxes
...
*/

(function(){

	Delegator.register('click', 'ResetCheckboxes', {
		handler: function(event, link, api) {
			event.stop();
			var checkboxes = link.getElements('!ul input[type="checkbox"]');
			checkboxes.invoke('set', 'checked', false);
		}
	});

})();