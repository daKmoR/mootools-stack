/*
---

name: Map.PolyLine

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Map]

provides: [Map.PolyLine]

...
*/

Map.PolyLine = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		// use all options from http://code.google.com/apis/maps/documentation/javascript/reference.html#PolylineOptions
	},
	
	subObjectMapping: {
		'this.polyLineObj': {
			functions: ['setOptions'],
			properties: ['map'],
			eventOptions: { instance: 'google.maps.event', addFunction: 'addListener', addObjectAsParam: true },
			events: ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick']
		}
	},
		
	polyLineObj: null,
	startPoint: false,
	
	initialize: function (map, path, options) {
		this.setOptions(options);
		this.options.map = map;
		
		if (path) {
			this.init(path, map);
		}
	},
	
	init: function(path) {
		this.options.path = typeOf(path) === 'array' ? path.toLatLng() : path;
		
		this.polyLineObj = new google.maps.Polyline(this.options);
		this.mapToSubObject();
	},
	
	// Adds one element to the end of the array and returns the new length of the array.
	addPoint: function(point) {
		var point = typeOf(point) === 'array' ? point.toLatLng() : point;
		
		if (!this.startPoint) {
			this.startPoint = point;
			return 1;
		}
		if (!this.polyLineObj && this.startPoint) {
			this.init([this.startPoint, point], this.options);
		}
		return this.polyLineObj.getPath().push(point);
	},

	// Inserts an element at the specified index.
	insertPointAt: function(index, point) {
		var point = typeOf(point) === 'array' ? point.toLatLng() : point;
		this.polyLineObj.getPath().insertAt(index, point);
	},

	// Removes the last element of the array and returns that element.
	removeLastPoint: function() {
		return this.polyLineObj.getPath().pop();
	},
	
	setLastPoint: function(point) {
		this.setPointAt(this.getLength()-1, point);
	},
	
	getLastPoint: function() {
		return this.getPointAt(this.getLength()-1);
	},

	// Returns the number of elements in this array.
	getLength: function() {
		return this.polyLineObj.getPath().getLength();
	},

	// Removes an element from the specified index.
	removePointAt: function(index) {
		this.polyLineObj.getPath().removeAt(index); 
	},

	// Sets an element at the specified index.
	setPointAt: function(index, point) {
		var point = typeOf(point) === 'array' ? point.toLatLng() : point;
		this.polyLineObj.getPath().setAt(index, point);
	},

	// Get an element at the specified index.
	getPointAt: function(index) {
		var point = this.polyLineObj.getPath().getAt(index);
		return [point['Ma'], point['Na']];
	},

	// Clears the polyLine path.
	clearPath: function() {
		this.setPath([]);
	},
	
	hide: function() {
		this.setMap(null);
	},

	show: function() {
		this.setMap(this.options.map);
	},

	toggle: function() {
		if (!!this.getMap()) {
			this.hide();
		}	else {
			this.show();
		}
	},

	destroy: function() {
		this.setMap(null);
		this.polyLineObj = null;
	},
	
	/*------------------------- CUSTOM MAPPING METHODS -------------------------*/
	
	setPath: function(path) {
		var path = typeOf(path) === 'array' ? path.toLatLng() : path;
		this.polyLineObj.setPath(path);
	},
	
	getPath: function() {
		var arrayPath = [], path = this.polyLineObj.getPath().getArray();
		Object.each(path, function(point) {
			arrayPath.push([point['Ma'], point['Na']]);
		});
		return arrayPath;
	}

});

Map.implement({
	
	polyLines: [],
	
	createPolyLine: function(options, path) {
		var polyLine = new Map.PolyLine(this.mapObj, path, options);
		this.addPolyLine(polyLine);
		return polyLine;
	},
	
	getPolyLines: function() {
		return this.polyLines;
	},
	
	setPolyLines: function(polyLines) {
		this.polyLines = polyLines;
	},
	
	addPolyLine: function(polyLine) {
		return this.polyLines.push(polyLine);
	}	

});