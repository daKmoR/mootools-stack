/*
---
description: Elements.equalize
license: MIT-style
authors: [Christopher Pitt, David Walsh]
provides: [Elements.equalize]
requires: 
  core/1.2.4: [Elements]
...
*/

// This plugin is based on the work of David Walsh (http://davidwalsh.name/mootools-equal-heights).

Elements.implement({
	'equalize': function(axis) {
		var max = 0,
			axis = axis ? axis.toLowerCase() : 'height',
			offset = 'offset' + axis.capitalize(),
			prop = (typeof document.body.style.maxHeight != 'undefined' ? 'min-' : '') + axis;

		if (['height', 'width'].indexOf(axis.toLowerCase()) == -1) {
			axis = 'height';
		}

		this.each(function(element, i) {
			var calc = element[offset];
			if (calc > max) max = calc;
		});
		this.each(function(element, i) {
			element.setStyle(prop, max - (element[offset] - element.getStyle(axis).toInt()));
		});

		return this;
	}
});