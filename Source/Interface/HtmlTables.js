/*
---

name: HtmlTables

description: create multiple FlexSlides

license: MIT-style license.

requires: More/HtmlTable

provides: HtmlTables

...
*/

var HtmlTables = new Class({

	htmlTables: [],
	
	initialize: function(elements, options) {
		$$(elements).each( function(el) {
			this.htmlTables.include( new HtmlTable(el, options) );
		}, this);
	},
	
	getFlexSlides: function() {
		return this.htmlTables;
	}
	
});