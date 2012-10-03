/*
---
name: Behavior.SmoothScroll
description: Adds a SmoothScroll interface to the input.
provides: [Behavior.SmoothScroll]
requires: [Behavior/Behavior, More/Fx.SmoothScroll]
script: Behavior.SmoothScroll.js

...
*/

Behavior.addGlobalFilter('SmoothScroll', {

	setup: function(element, api) {
		return new Fx.SmoothScroll();
	}

});