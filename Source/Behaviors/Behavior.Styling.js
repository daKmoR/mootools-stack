/*
---
name: Behavior.Styling
description: Adds a Styling interface
provides: [Behavior.Styling]
requires: [Behavior/Behavior, Select]
script: Behavior.Styling.js

...
*/

Behavior.addGlobalFilter('Styling', {

	require: ['target'],
	
	defaults: {
		property: 'height',
		'from-property': 'height',
		value: ''
	},
	
	setup: function(element, api) {
		var newValue = api.get('value');
		if (!newValue) {
			var dimensions = element.getDimensions();
			newValue = dimensions[api.getAs(String, 'from-property')] + api.getAs(Number, 'target-add-extra');
		}
		element.getElements(api.getAs(String, 'target')).invoke('setStyle', api.getAs(String, 'property'), newValue);
	}

});