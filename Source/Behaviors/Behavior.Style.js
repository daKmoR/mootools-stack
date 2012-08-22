/*
---
name: Behavior.Style
description: Adds a Style interface
provides: [Behavior.Style]
requires: [Behavior/Behavior, Core/Element.Dimensions]
script: Behavior.Style.js

...
*/

/**
 * Reads a dimension or style property of the element and writes it onto multiple targets.
 *
 * = Examples =
 * <code title="Default">
 *   <div id="element1" data-behavior="Style" data-style-targets="!body #element2">
 *     <p>some content<p>
 *     <p>has a height of 40px (via css or content size)</p>
 *   </div>
 *   <div id="element2"></div>
 * </code>
 * <output>
 *   //#element1 stays the same
 *   <div id="element2" style="height: 40px;"></div>
 * </output>
 *
 * <code title="Inline notation">
 *   property: to write the value (and read from)
 *   targets: elements to write the value on
 *   from-property: to read the value from (overwrites property only for reading)
 *   target-add-extra: adds x to the value before setting it on the targets
 *   invert: inverts the value before setting it on the targets
 *   divide: value will be divided by it before setting it on the targets
 * </code>
 * <output>
 * </output>
 *
 */

Behavior.addGlobalFilter('Style', {

	defaults: {
		property: 'height',
		invert: false,
		divide: 1
	},

	setup: function(element, api) {
		var newValue = api.get('value');
		if (!newValue) {
			var dimensions = element.getCoordinates();
			var fromProperty = api.getAs(String, 'from-property') ? api.getAs(String, 'from-property') : api.getAs(String, 'property');
			newValue = dimensions[fromProperty] || element.getStyle(fromProperty);
		}
		newValue = api.getAs(Number, 'targets-add-extra') ? newValue + api.getAs(Number, 'targets-add-extra') : newValue;
		newValue = api.getAs(Boolean, 'invert') ? newValue * (-1) : newValue;
		newValue = newValue / api.getAs(Number, 'divide');

		var targets = Array.from(element);
		targets = api.getAs(String, 'targets') ? element.getElements(api.getAs(String, 'targets')) : targets;

		targets.invoke('setStyle', api.getAs(String, 'property'), newValue);
	}

});