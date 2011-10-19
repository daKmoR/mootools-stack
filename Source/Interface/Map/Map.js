/*
---

name: Map

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Core/Class.Extras, SubObjectMapping]

provides: [Map]

...
*/

Array.implement({

	toLatLng: function() {
		if (this.length == 2 && typeOf(this[0]) === 'number' && typeOf(this[1]) === 'number' ) {
			return new google.maps.LatLng(this[0], this[1]);
		}
		
		for (var i = 0, l = this.length; i < l; i++) {
			if (typeOf(this[i]) === 'array') {
				this[i] = this[i].toLatLng();
			}
		}
		
		return this;
	},
	
	toLatLngBounds: function() {
		if (this.length === 2) {
			if (typeOf(this[0]) === 'array') {
				this[0] = this[0].toLatLng();
			}
			if (typeOf(this[1]) === 'array') {
				this[1] = this[1].toLatLng();
			}
			return new google.maps.LatLngBounds(this[0], this[1]);
		}
		return this;
	},
	
	toSize: function() {
		if (this.length == 2 && typeOf(this[0]) === 'number' && typeOf(this[1]) === 'number' ) {
			return new google.maps.Size(this[0], this[1]);
		}
		return this;
	},
	
	toPoint: function() {
		if (this.length == 2 && typeOf(this[0]) === 'number' && typeOf(this[1]) === 'number' ) {
			return new google.maps.Point(this[0], this[1]);
		}
		return this;
	},
	
	distanceTo: function(toPoint) {
		var fromPoint = this.toLatLng(), toPoint = toPoint.toLatLng();
		return google.maps.geometry.spherical.computeDistanceBetween(fromPoint, toPoint);
	},
	
	equalTo: function(arr){
		if (this.length !== arr.length) {
			return false;
		}
		for (var i = this.length - 1; i >= 0; i--) {
			if (this[i] !== arr[i]) {
				return false;
			}
		}
		return true;
	}
	
});

var Map = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		// use all Options from http://code.google.com/apis/maps/documentation/javascript/reference.html#MapOptions
		mapTypeId: 'roadmap', // ['hybrid', 'roadmap', 'satellite', 'terrain']
		zoom: 6,
		plugins: {},
		maxZoom: 21,
		minZoom: 0
	},

	subObjectMapping: {
		'this.mapObj': {
			functions: ['getBounds', 'getCenter', 'getDiv', 'getProjection', 'panBy', 'setOptions'],
			properties: ['mapTypeId', 'streetView', 'zoom'],
			eventOptions: { instance: 'google.maps.event', addFunction: 'addListener', addObjectAsParam: true },
			events: ['bounds_changed', 'center_changed', 'click', 'dblclick', 'drag', 'dragend', 'dragstart', 'idle', 'maptypeid_changed', 'mousemove', 'mouseout', 'mouseover', 'projection_changed', 'resize', 'rightclick', 'tilesloaded', 'zoom_changed']
		}
	},

	mapObj: null,
	plugins: {},

	initialize: function (mapContainer, center, options) {
		this.mapContainer = $(mapContainer);
		this.setOptions(options);
		
		this.options.center = typeOf(center) === 'array' ? center.toLatLng() : center;
		this.mapObj = new google.maps.Map(this.mapContainer, this.options);
		
		this.mapToSubObject();
		
		// load registered Plugins
		this.plugins = Object.merge(this.plugins, this.options.plugins);
		Object.each(this.plugins, function(plugin) {
			if (plugin.init) {
				plugin.init.apply(this);
			}
			if (plugin.html && plugin.onClick) {
				this.addControl(plugin.html, plugin.onClick, plugin.options);
			}
			if (plugin.element) {
				this.addControlElement(plugin.element, plugin.options);
			}
		}, this);
	},
	
	addControl: function(html, userFunction, options) {
		var wrapper = new Element('div');
		var el = new Element('div', {
			html: html, 
			'class': 'googleButton'
		});
		el.addEvent('click', userFunction.bind(this, el));
		wrapper.grab(el);
		this.addControlElement(wrapper, options);
	},
	
	addControlElement: function(el, options) {
		var pos = (options && options.position) ? options.position : 'TOP_RIGHT';
		var position = google.maps.ControlPosition[pos] || google.maps.ControlPosition.TOP_RIGHT;
		this.mapObj.controls[position].push(el);
	},
	
	getMap: function() {
		return this.mapObj;
	},
	
	getMaxZoom: function() {
		return this.options.maxZoom;
	},
	
	getMinZoom: function() {
		return this.options.minZoom;
	},
	
	/*------------------------- CUSTOM MAPPING METHODS -------------------------*/

	fitBounds: function(bounds) {
		var bounds = (typeOf(bounds) === 'array' && bounds.length === 2) ? bounds.toLatLngBounds() : bounds;
		this.mapObj.fitBounds(bounds);
	},
	
	panTo: function(point) {
		var point = typeOf(point) === 'array' ? point.toLatLng() : point;
		this.mapObj.panTo(point);
	},
	
	panToBounds: function(bounds) {
		var bounds = (typeOf(bounds) === 'array' && bounds.length === 2) ? bounds.toLatLngBounds() : bounds;
		this.mapObj.panToBounds(bounds);
	},
	
	setCenter: function(center) {
		var center = typeOf(center) === 'array' ? center.toLatLng() : center;
		this.mapObj.setCenter(center);
	}

});