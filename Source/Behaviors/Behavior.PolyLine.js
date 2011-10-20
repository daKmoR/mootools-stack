/*
---
name: Behavior.PolyLine
description: Adds a slide interface (PolyLine instance)
provides: [Behavior.PolyLine]
requires: [Behavior/Behavior, /Map.PolyLine, /Map.PolyLine.Animated]
script: Behavior.PolyLine.js

...
*/

Behavior.addGlobalFilter('PolyLine', {

	defaults: {
		target: '!div [data-behavior="Map"]',
		animated: true,
		color: '#000'
	},	

	setup: function(element, api) {
		var animated = api.getAs(Boolean, 'animated'),
			map = element.getElement(api.getAs(String, 'target')).getBehaviorResult('Map'),
			options = {
				'strokeColor': api.getAs(String, 'color')
			};
		var polyLine = animated === true ? map.createPolyLineAnimated(options) : map.createPolyLine(options);
		
		if (animated === true) {
			polyLine.fx.addEvent('setPoint', function(lat, lng) {
				var point = [lat, lng];
				map.panTo(point);
			});
		}
		return polyLine;
	}

});