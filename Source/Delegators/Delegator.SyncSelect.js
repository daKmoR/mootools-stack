/*
---
description: Syncs multiples Selects to always have the same selected value
provides: [Delegator.SyncSelect]
requires: [Behavior/Delegator, Core/Element]
script: Delegator.SyncSelect.js
name: Delegator.SyncSelect
...
*/

(function(){

	Delegator.register('change', 'SyncSelect', {

		defaults: {
			targets: '!body [data-trigger~="SyncSelect"]'
		},

		handler: function(event, element, api) {
			var selects = element.getElements(api.getAs(String, 'targets'));

			selects.each(function(select) {
				if (select !== element) {
					select.selectedIndex = element.selectedIndex;
				}
			});
		}

	});

})();