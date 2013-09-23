/*
---
name: Behavior.absolute-center
description: Adds a Style interface
provides: [Behavior.absolute-center]
requires: [Behavior/Behavior, Core/Element.Dimensions]
script: Behavior.absolute-center.js

...
*/

/**
 * Reads height of the element and sets it. Afterwards adds a css class.
 *
 * = Examples =
 * <code title="Default">
 *   <div data-behavior="absolute-center">[...]</div>
 * </code>
 * <output>
 *   <div data-behavior="absolute-center" style="height: 200px;" class="absolute-center">[...]</div>
 * </output>
 *
 * <code title="Options">
 *   class: (defaults to 'absolute-center') css class to set after height is set
 *   duration: how long to check for changes
 * </code>
 * <output>
 * </output>
 *
 */

(function(){

Behavior.addGlobalFilter('absolute-center', {

	defaults: {
		'class': 'absolute-center',
		duration: 1000
	},

	setup: function(element, api) {
		checkSize(element, api.getAs(Number, 'duration'));
		element.addClass(api.getAs(String, 'class'));
	}

});

var checkSize = function(element, duration, time) {
	time = time ? time : 0;
	var newValue = -100000;

	element.setStyle('height', 'auto');
	element.setStyle('position', 'static');

	var dimensions = element.getCoordinates();
	var height = dimensions['height'] - element.getStyle('padding-top').toInt() - element.getStyle('padding-bottom').toInt();
	newValue = height > newValue ? height : newValue;

	element.setStyle('height', newValue);
	element.setStyle('position', '');
	if (time < duration) {
		time += 10;
		checkSize.delay(10, null, [element, duration, time]);
	}
};

})();