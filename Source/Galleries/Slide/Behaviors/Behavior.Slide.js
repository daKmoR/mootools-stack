/*
---
name: Behavior.Slide
description: Adds a slide interface (FlexSlide instance)
provides: [Behavior.Slide]
requires: [Behavior/Behavior, /Slide]
script: Behavior.Slide.js

...
*/

Behavior.addGlobalFilter('Slide', {

	defaults: {
		'containerposition': false
	},

	setup: function(element, api) {
		var options = {};

		if (api.getAs(Boolean, 'containerposition')) {
			options = {
				containerPosition: { position: 'center' }
			};
		}

		return new Slide(element, options);
	}

});