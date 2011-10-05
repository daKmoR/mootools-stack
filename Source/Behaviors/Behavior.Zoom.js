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
		var to = Cookie.read('Behavior::Zoom')
		if (to) {
			Page.zoom(to);
		}
	}

});