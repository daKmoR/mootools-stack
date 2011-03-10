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
		return (this.length === 2) ? new google.maps.LatLngBounds(this[0].toLatLng(), this[1].toLatLng()) : this;
	}
	
});

var Map = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		// use all Options from http://code.google.com/apis/maps/documentation/javascript/reference.html#MapOptions
		mapTypeId: 'roadmap',
		zoom: 6
	},

	subObjectMapping: {
		'this.mapObj': {
			functions: ['getBounds', 'getCenter', 'getDiv', 'getProjection', 'panBy', 'setOptions'],
			properties: ['mapTypeId', 'streetView', 'zoom'],
			eventInstance: 'google.maps.event',
			eventAddFunction: 'addListener',
			eventAddObjectAsParam: true,
			events: ['bounds_changed', 'center_changed', 'click', 'dblclick', 'drag', 'dragend', 'dragstart', 'idle', 'maptypeid_changed', 'mousemove', 'mouseout', 'mouseover', 'projection_changed', 'resize', 'rightclick', 'tilesloaded', 'zoom_changed'],
		}
	},

	mapObj: null,

	initialize: function (mapContainer, center, options) {
		this.mapContainer = $(mapContainer);
		this.setOptions(options);
		
		this.options.center = typeOf(center) === 'array' ? center.toLatLng() : center;
		this.mapObj = new google.maps.Map(this.mapContainer, this.options);
		
		this.mapToSubObject();
	},

	getMap: function() {
		return this.mapObj;
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
	},
	
	/*------------------------- CREATORS (will move to SubClasses) -------------------------*/

	createOverlay: function(options) {
		return new Map.Overlay(this.mapObj, options);
	},

	createControl: function(tag, options) {
		return new Map.CustomControl(tag, this.mapObj, options);
	}

});