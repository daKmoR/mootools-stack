/*
---
name: Behavior.Map
description: Adds a slide interface (Map instance)
provides: [Behavior.Map]
requires: [Behavior/Behavior, /Map]
script: Behavior.Map.js

...
*/

Behavior.addGlobalFilters({

	Map: function(element, api) {
		return new Map(element, [48.1695, 16.3299], {
			zoom: 12
		});
		
	}

});