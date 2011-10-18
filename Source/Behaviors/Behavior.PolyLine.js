/*
---
name: Behavior.PolyLine
description: Adds a slide interface (PolyLine instance)
provides: [Behavior.PolyLine]
requires: [Behavior/Behavior, /Map.PolyLine]
script: Behavior.PolyLine.js

...
*/

Fx.Point = new Class({

	Extends: Fx,

	initialize: function(element, options){
		this.subject = element;
		this.parent(options);
	},

	set: function(now){
		this.subject.setLastPoint([now[0], now[1]]);
		this.fireEvent('setPoint', [now[0], now[1]]);
		return this;
	},
	
	compute: function(from, to, delta){
		var now = {};
		for (var p in from) now[p] = this.parent(from[p], to[p], delta);
		return now;
	},
	
	start: function(from, to){
		if (arguments.length == 1){
			var to = from;
			var from = this.subject.getLastPoint();
		}
		return this.parent(from, to);
	}

});

Behavior.addGlobalFilter('PolyLine', {

	defaults: {
		target: '!div [data-behavior="Map"]',
		animated: true
	},	

	setup: function(element, api) {
		var animated = api.getAs(Boolean, 'animated');
		var map = element.getElement(api.getAs(String, 'target')).getBehaviorResult('Map');
		var polyLine = animated === true ? map.createPolyLineAnimated() : map.createPolyLine();
		
		if (animated === true) {
			polyLine.fx.addEvent('setPoint', function(lat, lng) {
				var point = [lat, lng];
				map.panTo(point);
			});
		}
		return polyLine;
	}

});