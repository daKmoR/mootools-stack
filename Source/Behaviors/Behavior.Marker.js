/*
---
name: Behavior.Marker
description: Adds a slide interface (Marker instance)
provides: [Behavior.Marker]
requires: [Behavior/Behavior, /Map.Marker]
script: Behavior.Marker.js

...
*/

Behavior.addGlobalFilter('Marker', {

	require: ['position'],
	
	defaults: {
		target: '!div [data-behavior="Map"]',
	},	

	setup: function(element, api) {
		var map = element.getElement(api.getAs(String, 'target')).getBehaviorResult('Map');
		return map.createMarker(api.getAs(Array, 'position'));
	}

});