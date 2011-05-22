/*
---

name: FlexBoxes

description:  create multiple FlexBoxes

license: MIT-style license.

requires: FlexBox

provides: FlexBoxes

...
*/

var FlexBoxes = new Class({

	flexBoxes: [],
	
	initialize: function(elements, options) {
		elements = $$(elements)
		elements.each( function(el) {
			this.flexBoxes.include( new FlexBox(el, elements, options) );
		}, this);
	},
	
	getFlexBoxes: function() {
		return this.flexBoxes;
	}
	
});