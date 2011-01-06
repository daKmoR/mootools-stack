/*
---

name: MooPath.Ellipse

description: Move objects over an ellipse

license: MIT-style license.

requires: [MooPath]

provides: MooPath.Ellipse

...
*/

MooPath.Ellipse = new Class({

	Extends: MooPath,
	
	options: {
		ellipse: {x: 500, y: 300},
		factor: 0.5,
		useOpacity: true,
		opacityLimit: { min: 0.2, max: 0.7, focus: 1 },
		getSizeFromContainer: true
	},

	set: function(el, position) {
		// Set the styles of the element at position
		var origsize = el.retrieve(this.options.origsize);
		
		if (this.options.getSizeFromContainer) {
			this.options.ellipse = el.getParent().getSize();
		}
		
		var a = this.options.ellipse.x/2;
		var b = this.options.ellipse.y/2;

		// 0-1 scale to 0-2pi
		position = 2 * Math.PI * position;

		var newy = b + b * Math.sin(position - 0.5 * Math.PI);
		var factor = this.realFactor(newy);
		var point = {
			x: a + (a * Math.sin(position-Math.PI) * factor),
			y: newy
		};
		
		var values = {
			'bottom':  Math.round(point.y),
			'left':    Math.round(point.x - (origsize.x * factor / 2)),
			'z-index': this.options.ellipse.y - Math.round(point.y)
		};
		
		var imageValues = {
			'width':   Math.round(origsize.x * factor),
			'height':  Math.round(origsize.y * factor)
		};
		if( this.options.useOpacity ) {
			if( el != this.elements.item[this.current] ) {
				imageValues.opacity = ((this.options.ellipse.y-point.y) / this.options.ellipse.y).round(1).limit(this.options.opacityLimit.min, this.options.opacityLimit.max);
			} else {
				imageValues.opacity = this.options.opacityLimit.focus;
			}
		}
		
		
		var tmp = el.getElement('img');
		if( $defined(tmp) ) {
			tmp.setStyles(imageValues);
		} else {
			$extend(values, imageValues);
		}
		
		el.setStyles(values);
	},

	realFactor: function(posy) {
		// Get the factor that aplies on position posy
		return ((this.options.ellipse.y - posy) * (1 - this.options.factor) / this.options.ellipse.y) + this.options.factor;
	},

	movement: function(el) {
		// Calculate movement diff (current position + diff = new position)
		var diff = el.retrieve(this.options.position);
		while (diff < 0) diff += this.maxposition;
		while (diff >= this.maxposition) diff -= this.maxposition;

		// Reverse direction
		if (diff >= this.maxposition / 2) {
			diff -= this.maxposition;
		}

		return diff;
	}
});