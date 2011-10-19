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
	
	initialize: function (map, path, options) {
		this.parent(map, path, options);
		this.fx = new Fx.Point(this, { duration: 500, transition: Fx.Transitions.linear });
	},	
	
	// Adds one element to the end of the array and returns the new length of the array.
	addPoint: function(point, show) {
		var show = show === 'undefined' ? this.options.showNewPoints : !!show;
		return show ? this.parent(point) : this.addVirtualPoint(point);
	},
	
	addVirtualPoint: function(point) {
		var point = typeOf(point) === 'array' ? point : [point['Ma'], point['Na']];
		this.points.push(point);
	},
	
	start: function(i) {
		if (this.getLength() === this.points.length) return;
		if (!this.polyLineObj || (this.polyLineObj && this.getLength() == 0)) {
			this.addPoint(this.points[0], true);
		}
		var i = i >= 0 ? i : this.getLength()-1 >= 0 ? this.getLength()-1 : 0;
		
		this.addPoint(this.points[i], true);
		this.fx.start(this.points[i+1]).chain(function() {
			if (i+1 < this.points.length-1) {
				this.start(i+1);
			} else {
				this.fireEvent('pointChange', this.points[i+1]);
			}
		}.bind(this));
		
		this.fireEvent('pointChange', this.points[i]);
	},
	
	goTo: function(goTo) {
		if (goTo >= this.points.length || (goTo === this.getLength()-1 && !this.fx.hasStarted())) return;
		var goTo = goTo >= 0 ? goTo : this.points.length-1;
		
		var current = this.getLength()-1 >= 0 ? this.getLength()-1 : 0;
		if (current > 0 && goTo > current) {
			this.setPointAt(current, this.points[current]);
		}
		if (current > 0 && goTo < current) {
			this.clearPath();
			current = 0;
		}
		if (current === 0) {
			this.addPoint(this.points[0], true);
		}
		
		for (var i = current+1; i <= goTo; i++) {
			this.addPoint(this.points[i], true);
		}
		this.fx.resume();
		this.fx.cancel();
	},
	
	pause: function() {
		this.fx.pause();
	},
	
	resume: function() {
		this.fx.resume();
		if (!this.fx.isRunning()) {
			this.start();
		}
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