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
		target: '!div [data-behavior="Map"]'
	},	

	setup: function(element, api) {
		var map = element.getElement(api.getAs(String, 'target')).getBehaviorResult('Map');
		var polyLine = map.createPolyLine();
		
		(function() {
			//polyLine.setLastPoint([1,1]);
			
			polyLine.hide();
			var path = polyLine.getPath();
			var anim = map.createPolyLine();
			
			
			var fx = new Fx.Point(anim, { duration: 2000, transition: Fx.Transitions.linear });
			
			anim.addPoint(path[0]);
			anim.addPoint(path[0]);
			
			// fx.start(path[1]).chain(function() {
				// fx.start(path[2]);
				// console.log('done');
			// });
			
			fx.start(path[3]).chain(function() {
				anim.addPoint(path[3]);
				this.start(path[4]);
			});
			
		}).delay(500);
		
		return polyLine;
	}

});