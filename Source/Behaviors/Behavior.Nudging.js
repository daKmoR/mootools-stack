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

	defaults: {
		property: 'padding-left',
		value: 10,
		duration: 200
	},

	setup: function(element, api) {
		var resetValue = api.getAs(Number, 'resetValue') || element.getStyle('padding-left');
		element.set('tween', {
			duration: api.getAs(Number, 'duration')
		});
		element.addEvents({
			'mouseenter': function() {
				element.tween(api.getAs(String, 'property'), api.getAs(Number, 'value'));
			}.bind(this),
			'mouseleave': function() {
				element.tween(api.getAs(String, 'property'), resetValue);
			}.bind(this)
		});
	}

});