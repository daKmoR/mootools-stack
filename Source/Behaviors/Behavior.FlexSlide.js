/*
---
name: Behavior.FlexSlide
description: Adds a slide interface (FlexSlide instance)
provides: [Behavior.FlexSlide]
requires: [Behavior/Behavior, /FlexSlide]
script: Behavior.FlexSlide.js

...
*/

Behavior.addGlobalFilters({

	FlexSlide: function(element, api) {
		var myFlexSlide = new FlexSlide(element);
	}

});