/*
---
name: Behavior.Style
description: Adds a Style interface
provides: [Behavior.Style]
requires: [Behavior/Behavior]
script: Behavior.Style.js

...
*/

Behavior.addGlobalFilter('Style', {

	defaults: {
		property: 'height',
		invert: false,
		divide: 1
	},

	setup: function(element, api) {
		var newValue = api.get('value');
		if (!newValue) {
			var dimensions = element.getDimensions();
			var fromProperty = api.getAs(String, 'from-property') ? api.getAs(String, 'from-property') : api.getAs(String, 'property');
			newValue = dimensions[fromProperty];
		}
		newValue = api.getAs(Number, 'targets-add-extra') ? newValue + api.getAs(Number, 'targets-add-extra') : newValue;
		newValue = api.getAs(Boolean, 'invert') ? newValue * (-1) : newValue;
		newValue = newValue / api.getAs(Number, 'divide');

		var targets = Array.from(element);
		targets = api.getAs(String, 'targets') ? element.getElements(api.getAs(String, 'targets')) : targets;

		targets.invoke('setStyle', api.getAs(String, 'property'), newValue);
	}

});