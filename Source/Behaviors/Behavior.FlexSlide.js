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

	defaults: {
		auto: true,
		size: 'element'
	},

	FlexSlide: function(element, api) {
		return new FlexSlide(element, {
			auto: api.getAs(Boolean, 'auto'),
			size: api.getAs(String, 'size'),
		});
	}

});