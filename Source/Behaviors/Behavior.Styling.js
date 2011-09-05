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
		'target-property': 'height'
	},
	setup: function(element, api) {
		var dimensions = element.getDimensions();
		var newValue = dimensions[api.get('property')] + api.getAs(Number, 'target-add-extra');
		$$(api.getAs(String, 'target')).invoke('setStyle', api.get('target-property'), newValue);
	}

});