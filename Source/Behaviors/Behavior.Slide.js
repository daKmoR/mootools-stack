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
		auto: true,
		size: 'element',
		advanced: true
	},

	setup: function(element, api) {
		// var options = {
			// auto: api.getAs(Boolean, 'auto'),
			// size: api.getAs(String, 'size'),
			// keyboardListener: true,
			// mode: 'once',
			// auto: false,
			// dynamicLoading: false,
			// active: false
		// };
		// if (api.getAs(Boolean, 'advanced')) {
			// var slide = new FlexSlide.Advanced(element, options);
		// } else {
			// var slide = new FlexSlide(element, options);
		// }
		var slide = new Slide(element);
		return slide;
	}

});