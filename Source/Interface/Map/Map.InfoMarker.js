/*
---

name: Map.InfoMarker

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Thomas Allmer

requires: [Map]

provides: [Map.InfoMarker]

...
*/

Map.InfoMarker = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		// use all options from http://code.google.com/apis/maps/documentation/javascript/reference.html#InfoMarkerOptions
		// use all options from http://code.google.com/apis/maps/documentation/javascript/reference.html#InfoWindowOptions
		isOpen: false
	},
	
	subObjectMapping: {
		'this.infoWindowObj': {
			functions: ['close', 'setOptions'],
			properties: ['content'],
			eventInstance: 'google.maps.event',
			eventAddFunction: 'addListener',
			events: ['closeclick', 'content_changed', 'domready']
		},
		'this.markerObj': {
			functions: ['setOptions'],
			properties: ['animation', 'clickable', 'cursor', 'draggable', 'flat', 'icon', 'map', 'shadow', 'shape', 'title', 'visible'],
			eventInstance: 'google.maps.event',
			eventAddFunction: 'addListener',
			events: ['animation_changed', 'click', 'clickable_changed', 'cursor_changed', 'dblclick', 'drag', 'dragend', 'draggable_changed', 'dragstart', 'flat_changed', 'icon_changed', 'mousedown', 'mouseout', 'mouseover', 'mouseup', 'rightclick', 'shadow_changed', 'shape_changed', 'title_changed', 'visible_changed']
		}
	},

	infoWindowObj: null,
	markerObj: null,

	initialize: function (position, map, options) {
		this.setOptions(options);
		
		this.options.position = typeOf(position) === 'array' ? position.toLatLng() : position;
		this.map = map;
		
		this.infoWindowObj = new Map.InfoWindow(position, this.options);
		this.markerObj = new Map.Marker(position, map, this.options);
		
		this.mapToSubObject();
		this.mapManualEvents();
		
		if (this.options.isOpen === true) {
			this.open();
		}
		
		this.markerObj.addEvent('click', function() {
			this.open();
		}.bind(this));
	},
	
	/*------------------------- CUSTOM MAPPING METHODS -------------------------*/
	
	// MVC object is usually a marker.
	open: function(MVCObject) {
		var MVCObject = MVCObject || this.markerObj.markerObj;
		this.infoWindowObj.open(this.map, MVCObject);
	},
	
	setPosition: function(point) {
		var point = typeOf(point) === 'array' ? point.toLatLng() : point;
		this.infoMarkerObj.setPosition(point);
		this.markerObj.setPosition(point);
	},
	
	getPosition: function() {
		return { marker: this.markerObj.getPosition(), infoWindow: this.infoWindowObj.getPosition() }
	},

	// zIndex = { marker: 2, infoWindow: 5 }
	setZIndex: function(zIndex) {
		this.markerObj.setZIndex(zIndex.marker);
		this.markerObj.setZIndex(zIndex.infoWindow);
	},
	
	getZIndex: function() {
		return { marker: this.markerObj.getZIndex(), infoWindow: this.infoWindowObj.getZIndex() }
	},
	
	mapManualEvents: function() {
		google.maps.event.addListener(this.markerObj, 'position_changed', function() {
			this.fireEvent('marker_position_changed');
		}.bind(this));
		google.maps.event.addListener(this.infoWindowObj, 'position_changed', function() {
			this.fireEvent('infowindow_position_changed');
		}.bind(this));
		google.maps.event.addListener(this.markerObj, 'zindex_changed', function() {
			this.fireEvent('marker_zindex_changed');
		}.bind(this));
		google.maps.event.addListener(this.infoWindowObj, 'zindex_changed', function() {
			this.fireEvent('infowindow_zindex_changed');
		}.bind(this));
	}

});

Map.implement({
	
	createInfoMarker: function(position, options) {
		return new Map.InfoMarker(position, this.mapObj, options);
	}

});