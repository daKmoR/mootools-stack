/*
---

name: Selects

description:  create multiple Selects

license: MIT-style license.

requires: Select

provides: Selects

...
*/

var Selects = new Class({

	selects: [],
	
	initialize: function(elements, options) {
		elements = $$(elements)
		elements.each( function(el) {
			this.selects.include( new Select(el, options) );
		}, this);
	},
	
	getSelects: function() {
		return this.selects;
	}
	
});