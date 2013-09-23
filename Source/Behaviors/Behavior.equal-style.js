/*
---
name: Behavior.equal-style
description: Adds a Style interface
provides: [Behavior.equal-style]
requires: [Behavior/Behavior, Core/Element.Dimensions]
script: Behavior.equal-style.js

...
*/

/**
 * Reads a dimension or style property of the element and writes it onto multiple targets.
 *
 * = Examples =
 * <code title="Default">
 *   <div class="container" data-behavior="equal-style">
 *     <div class="column">[...]</div>
 *     <div class="column">[...]</div>
 *   </div>
 * </code>
 * <output>
 *   <div class="container" data-behavior="equal-style">
 *     <div class="column" style="height: 200px">[...]</div>
 *     <div class="column" style="height: 200px">[...]</div>
 *   </div>
 * </output>
 *
 * <code title="Specific">
 *   <div id="element1" data-behavior="equal-style" data-equal-style-targets="!body #element1, !body #element2">
 *     <p>some content<p>
 *     <p>has a height of 40px (via css or content size)</p>
 *   </div>
 *   <div id="element2" style="height: 120px"></div>
 * </code>
 * <output>
 *   <div id="element1" style="height: 120px;" data-behavior="equal-style" data-equal-style-targets="!body #element1, !body #element2">
 *     <p>some content<p>
 *     <p>has a height of 40px (via css or content size)</p>
 *   </div>
 *   <div id="element2" style="height: 120px;"></div>
 * </output>
 *
 * <code title="Options">
 *   value: hard coded value to use
 *   property: to read the value from
 *   targets: (defaults to '>') elements to include in the calculation and later set the value on
 *   find: [min, max] search for the min or max value on all targets
 *   duration: how long to check for changes
 * </code>
 * <output>
 * </output>
 *
 */

(function(){

Behavior.addGlobalFilter('equal-style', {

	defaults: {
		targets: '>',
		property: 'height',
		find: 'max',
		duration: 1000
	},

	setup: function(element, api) {
		var targets = element.getElements(api.getAs(String, 'targets'));

		var newValue = api.get('value');
		if (!newValue) {
			checkSize(targets, api.getAs(String, 'find'), api.getAs(String, 'property'), api.getAs(Number, 'duration'));
		} else {
			targets.invoke('setStyle', api.getAs(String, 'property'), newValue);
		}
	}

});

var checkSize = function(targets, find, property, duration, time) {
	time = time ? time : 0;
	newValue = find === 'max' ? -100000 : 100000;
	var dimensions;
	targets.each(function(target) {
		target.setStyle(property, 'auto');
		dimensions = target.getCoordinates();
		if (find === 'min') {
			newValue = dimensions[property] < newValue ? dimensions[property] : newValue;
		} else {
			newValue = dimensions[property] > newValue ? dimensions[property] : newValue;
		}
	});

	targets.invoke('setStyle', property, newValue);
	if (time < duration) {
		time += 10;
		checkSize.delay(10, null, [targets, find, property, duration, time]);
	}
};

})();