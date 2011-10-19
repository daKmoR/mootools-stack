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
	},
	
	hasStarted: function(){
		return (this.frame < this.frames) && !this.isRunning();
	}

});

Behavior.addGlobalFilter('PolyLine', {

	defaults: {
		target: '!div [data-behavior="Map"]',
		animated: true,
		color: '#000'
	},	

	setup: function(element, api) {
		var animated = api.getAs(Boolean, 'animated'),
			map = element.getElement(api.getAs(String, 'target')).getBehaviorResult('Map'),
			options = {
				'strokeColor': api.getAs(String, 'color')
			};
		var polyLine = animated === true ? map.createPolyLineAnimated(options) : map.createPolyLine(options);
		
		if (animated === true) {
			polyLine.fx.addEvent('setPoint', function(lat, lng) {
				var point = [lat, lng];
				map.panTo(point);
			});
		}
		return polyLine;
	}

});