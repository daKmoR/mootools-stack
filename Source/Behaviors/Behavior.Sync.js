/*
---
name: Behavior.Sync
description: allows to sync automtically
provides: [Behavior.Sync]
requires: [Behavior/Behavior, Behavior/Element.Data, More/Object.Extras]
script: Behavior.Sync.js

...
*/

Behavior.addGlobalFilter('Sync', {

	require: ['from'],

	defaults: {
		'event': 'change',
		'from-property': 'html',
		'to-property': 'value',
		'autoSubmit': true,
		'submit-target': '!form'
	},

	setup: function(element, api) {
		element.getElement(api.getAs(String, 'from')).addEvent('change', function() {
			element.set(api.getAs(String, 'to-property'), this.get(api.getAs(String, 'from-property')));
			if (api.getAs(Boolean, 'autoSubmit')) {
				element.getElement(api.getAs(String, 'submit-target')).submit();
			}
		});
	}

});