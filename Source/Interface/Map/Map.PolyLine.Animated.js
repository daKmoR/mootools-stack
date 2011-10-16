/*
---

name: Map.PolyLine.Animated

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Thomas Allmer

requires: [Map.PolyLine]

provides: [Map.PolyLine.Animated]

...
*/

Map.PolyLine.Animated = new Class({
	Extends: Map.PolyLine,

	options: {
		showNewPoints: false
	},
	
	points: [],
	
	// Adds one element to the end of the array and returns the new length of the array.
	addPoint: function(point, show) {
		var show = show === 'undefined' ? this.options.showNewPoints : !!show;
		return show ? this.parent(point) : this.addVirtualPoint(point);
	},
	
	addVirtualPoint: function(point) {
		var point = typeOf(point) === 'array' ? point : [point['Ma'], point['Na']];
		this.points.push(point);
	},
	
	setLastPoint: function(point) {
		this.setPointAt(this.getLength()-1, point);
	},
	
	getLastPoint: function() {
		return this.getPointAt(this.getLength()-1);
	},
	
	initAnimation: function() {
		this.fx = new Fx.Point(this, { duration: 500, transition: Fx.Transitions.linear });
		this.addPoint(this.points[0], true);
	},
	
	start: function(i) {
		if (!this.fx) {
			this.initAnimation();
		}
		var i = i || 0;
		
		this.addPoint(this.points[i], true);
		this.fx.start(this.points[i+1]).chain(function() {
			if (i+1 < this.points.length-1) {
				this.start(i+1);
			}
		}.bind(this));
		
		this.fireEvent('pointChange', this.points[i]);
	},
	
	pause: function() {
		this.fx.pause();
	},
	
	resume: function() {
		this.fx.resume();
	}

});

Map.implement({
	
	polyLinesAnimated: [],
	
	createPolyLineAnimated: function(options, path) {
		var polyLineAnimated = new Map.PolyLine.Animated(this.mapObj, path, options);
		this.addPolyLineAnimated(polyLineAnimated);
		return polyLineAnimated;
	},
	
	getPolyLinesAnimated: function() {
		return this.polyLinesAnimated;
	},
	
	setPolyLineAnimateds: function(polyLinesAnimated) {
		this.polyLinesAnimated = polyLinesAnimated;
	},
	
	addPolyLineAnimated: function(polyLineAnimated) {
		return this.polyLinesAnimated.push(polyLineAnimated);
	}

});