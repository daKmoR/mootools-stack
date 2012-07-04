/*
---
name: Behavior.Nudging
description: Adds a Nudging interface to the input.
provides: [Behavior.Nudging]
requires: [Behavior/Behavior, Core/Fx.Tween, Behavior/Element.Data, More/Object.Extras]
script: Behavior.Nudging.js

...
*/

Behavior.addGlobalFilter('Nudging', {

	setup: function(element, api) {
		element.addEvents({
			'mouseenter': function() { this.tween('padding-left', 20); },
			'mouseleave': function() { this.tween('padding-left', 0); }
		});
	}

});