/*
---

name: FlexSlides

description: create multiple FlexSlides

license: MIT-style license.

requires: FlexSlide

provides: FlexSlides

...
*/

var FlexSlides = new Class({

	flexSlides: [],
	
	initialize: function(elements, options) {
		$$(elements).each( function(el) {
			this.flexSlides.include( new FlexSlide(el, options) );
		}, this);
	},
	
	getFlexSlides: function() {
		return this.flexSlides;
	},
	
	stop: function() {
		$each( this.flexSlides, function(el) {
			$clear(el.autotimer);
		});
	}
	
});