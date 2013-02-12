/*
---
name: Behavior.Position
description: Adds a Style interface
provides: [Behavior.Position]
requires: [Behavior/Behavior, Core/Element.Dimensions]
script: Behavior.Position.js

...
*/

/**
 * Reads a dimension or style property of the element and writes it onto multiple targets.
 *
 * = Examples =
 * <code title="Default">
 *   <div id="element1" data-behavior="Position" data-equalstyle-targets="!body #element2">
 *     <p>some content<p>
 *     <p>has a height of 40px (via css or content size)</p>
 *   </div>
 *   <div id="element2" style="height: 120px"></div>
 * </code>
 * <output>
 *   <div id="element1" style="height: 120px;" data-behavior="Position" data-equalstyle-targets="!body #element2">
 *     <p>some content<p>
 *     <p>has a height of 40px (via css or content size)</p>
 *   </div>
 *   <div id="element2" style="height: 120px;"></div>
 * </output>
 *
 * <code title="Options">
 *   value: hard coded value to use
 *   property: to read the value from
 *   targets: elements to include in the calculation and later set the value on (executing element is always included)
 *   find: [min, max] search for the min or max value on all targets
 *   duration: how long to check for changes
 * </code>
 * <output>
 * </output>
 *
 */

Behavior.addGlobalFilter('Position', {

	delay: 10,

	defaults: {
		reposition: true
	},

	setup: function(element, api) {
		element.position();

		if(api.getAs(Boolean, 'reposition') === true) {
			window.addEvent('resize', function() {
				element.position();
			}.bind(this));
		}
	}

});
