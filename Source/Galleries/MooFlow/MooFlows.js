/*
---

name: MooFlows

description: 

license: MIT-style license.

requires: [MooFlow]

provides: MooFlows

...
*/ 

var MooFlows = new Class({

	mooFlows: [],
	
	initialize: function(elements, options) {
		$$(elements).each( function(el) {
			this.mooFlows.include( new MooFlow(el, options) );
		}, this);
	},
	
	getMooFlows: function() {
		return this.mooFlows;
	}
	
});