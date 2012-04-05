/*
---
name: Behavior.Zoom
description: Adds a Zoom interface
provides: [Behavior.Zoom]
requires: [Behavior/Behavior, Core/Cookie, PageZoom]
script: Behavior.Zoom.js

...
*/

Behavior.addGlobalFilter('Zoom', {

	setup: function(element, api) {
		Page.applySavedZoom();
	}

});