/*
---
name: Behavior.InfoMarker
description: Adds a slide interface (InfoMarker instance)
provides: [Behavior.InfoMarker]
requires: [Behavior/Behavior, /Map.InfoMarker]
script: Behavior.InfoMarker.js

...
*/

Behavior.addGlobalFilter('InfoMarker', {

	require: ['position'],
	
	defaults: {
		target: '!div [data-behavior="Map"]',
	},	

	setup: function(element, api) {
		var map = element.getElement(api.getAs(String, 'target')).getBehaviorResult('Map');
		var infoMarker = map.createInfoMarker(api.getAs(Array, 'position'));
		infoMarker.setContent(element.get('html'));
		return infoMarker;
	}

});