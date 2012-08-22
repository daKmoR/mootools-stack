/*
---
name: Behavior.EqualStyle
description: Adds a Style interface
provides: [Behavior.EqualStyle]
requires: [Behavior/Behavior, Core/Element.Dimensions]
script: Behavior.EqualStyle.js

...
*/

/**
 * Reads a dimension or style property of the element and writes it onto multiple targets.
 *
 * = Examples =
 * <code title="Default">
 *   <div id="element1" data-behavior="EqualStyle" data-equalstyle-targets="!body #element2">
 *     <p>some content<p>
 *     <p>has a height of 40px (via css or content size)</p>
 *   </div>
 *   <div id="element2" style="height: 120px"></div>
 * </code>
 * <output>
 *   <div id="element1" style="height: 120px;" data-behavior="EqualStyle" data-equalstyle-targets="!body #element2">
 *     <p>some content<p>
 *     <p>has a height of 40px (via css or content size)</p>
 *   </div>
 *   <div id="element2" style="height: 120px;"></div>
 * </output>
 *
 * <code title="Inline notation">
 *   value: hard coded value to use
 *   property: to read the value from
 *   targets: elements to include in the calculation and later set the value on (executing element is always included)
 *   find: [min, max] search for the min or max value on all targets
 * </code>
 * <output>
 * </output>
 *
 */

Behavior.addGlobalFilter('EqualStyle', {

	require: ['targets'],

	defaults: {
		property: 'height',
		find: 'max'
	},

	setup: function(element, api) {
		var targets = element.getElements(api.getAs(String, 'targets'));
		targets.include(element);

		var newValue = api.get('value');
		if (!newValue) {
			newValue = api.getAs(String, 'find') === 'max' ? -100000 : 100000;
			var property = api.getAs(String, 'property'), dimensions;
			targets.each(function(target) {
				dimensions = target.getCoordinates();
				if (api.getAs(String, 'find') === 'min') {
					newValue = dimensions[property] < newValue ? dimensions[property] : newValue;
				} else {
					newValue = dimensions[property] > newValue ? dimensions[property] : newValue;
				}
			});
		}

		targets.invoke('setStyle', api.getAs(String, 'property'), newValue);
	}

});