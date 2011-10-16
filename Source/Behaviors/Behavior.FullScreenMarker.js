/*
---
name: Behavior.FullScreenMarker
description: Adds a slide interface (FullScreenMarker instance)
provides: [Behavior.FullScreenMarker]
requires: [Behavior/Behavior, /Map.FullScreenMarker]
script: Behavior.FullScreenMarker.js

...
*/

Behavior.addGlobalFilter('FullScreenMarker', {

	require: ['position'],
	
	defaults: {
		target: '!div [data-behavior="Map"]',
	},	

	setup: function(element, api) {
		var map = element.getElement(api.getAs(String, 'target')).getBehaviorResult('Map');
		var fullScreenMarker = map.createFullScreenMarker(api.getAs(Array, 'position'));
		fullScreenMarker.wrap.grab(element);
		return fullScreenMarker;
	}

});