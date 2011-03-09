/*
---

name: Map

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Core/Class.Extras, Core/Element.Event, Core/Element.Dimensions, Core/Selectors, SubObjectMapping]

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
		/*backgroundColor : '#ccc',
		disableDefaultUI: false,
		disableDoubleClickZoom: true,
		draggable: true,
		draggableCursor: 'cursor',
		draggingCursor: 'cursor',
		keyboardShortcuts: true,
		navigationControl: true,
		scaleControl: true,
		scrollwheel: true,
		streetViewControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP,*/
		zoom: 6,
		center: [7.6, -74],
		mapToSubObject: {
			'this.mapObj': {
				functions: ['center', 'zoom', 'mapTypeId', 'streetView'],
				functions: ['center'],
				eventInstance: 'google.maps.event',
				eventAddFunction: 'addListener',
				events: ['bounds_changed', 'center_changed', 'click', 'dblclick', 'drag', 'dragend', 'dragstart', 'idle', 'maptypeid_changed', 'mousemove', 'mouseout', 'mouseover', 'projection_changed', 'resize', 'rightclick', 'tilesloaded', 'zoom_changed'],
				events: ['click']
			}
		},
		onClick: function(e) {
			console.log('boom', e);
		}
	},

	mapObj: null,

	initialize: function (mapContainer, options) {
		this.mapContainer = $(mapContainer);
		this.setOptions(options);
		
		this.options.center = typeOf(this.options.center) === 'array' ? new google.maps.LatLng(this.options.center[0], this.options.center[1]) : this.options.center;
		this.options.mapTypeId = google.maps.MapTypeId.ROADMAP;
		
		this.mapObj = new google.maps.Map(this.mapContainer, this.options);
		
		this.mapToSubObject();
			
		this.createMarker([7.8, -74]);
		this.createInfoMarker([7.6, -74], 'test');
		this.createPolygon([[7.6, -74], [7.0, -74], [7.3, -74.5], [7.6, -74.5]]);
		this.createCircle([7.8, -74], 100000);
		this.createRectangle([[11.04,-75.75], [7.9,-73.8]]);
		var tmp = this.createPolyLine([[7.8, -74], [7.2, -74], [7.2, -74.5], [7.8, -74.5]]);
		tmp.addLine([7.9,-73.8]);
		
	},
	
	/**************************************************************
	API BASE CLASSES
	**************************************************************/

	//LatLng API Class
	createLatLng: function(latitude, longitude) {
		return new google.maps.LatLng(latitude, longitude);
	},

	//LatLng API Class Method
	getLatitude: function(latLng) {
		var latLng = latLng || this.getCenter();
		return latLng.lat();
	},

	//LatLng API Class Method
	getLongitude: function(latLng) {
		var latLng = latLng || this.getCenter();
		return latLng.lng();
	},

	//LatLngBounds API Class
	createLatLngBounds: function(SWLatLng, NELatLng) {
		return new google.maps.LatLngBounds(SWLatLng, NELatLng);
	},

	//LatLngBounds API Class Method
	getBoundsCenter: function(bounds) {
		return bounds.getCenter();
	},

	/**************************************************************
	MAP CLASS (Google Maps API Class)
	**************************************************************/

	fitBounds: function(LatLngBounds) {
		var LatLngBounds = LatLngBounds || this.getBounds;
		this.mapObj.fitBounds(LatLngBounds);
	},

	getBounds: function() {
		return this.mapObj.getBounds();
	},

	panBy: function(x, y) {
		var x = x || 0;
		var y = y || 0;
		this.mapObj.panBy(x,y);
	},

	panTo: function(latLng) {
		var latLng = latLng || this.getCenter();
		this.mapObj.panTo(latLng);
	},

	panToBounds: function(latLngBounds) {
		var latLngBounds = latLngBounds || this.getBounds();
		this.mapObj.panToBounds(latLngBounds);
	},

	getDiv: function() {
		return this.mapObj.getdiv();
	},

	setMapOptions: function(mapOptions) {
		var mapOptions = mapOptions || this.mapOptions;
		this.mapObj.setOptions(mapOptions);
	},

	getMap: function() {
		return this.mapObj;
	},

/*------------------------- CUSTOM METHODS -------------------------*/

	createMarker: function(position, options) {
		return new Map.Marker(position, this.mapObj, options);
	},

	createInfoMarker: function(position, content, options) {
		options = options || {};
		options.isOpen = options.isOpen != undefined ? options.isOpen : false;
		options.content = content;
		
		var marker = this.createMarker(position, options);
		var infoWindow = new Map.InfoWindow(position, options);
		
		marker.addEvent('click', function() {
			infoWindow.open(this.mapObj, marker.markerObj);
		}.bind(this));
		
		if (options.isOpen === true) {
			infoWindow.open(this.mapObj, marker.markerObj);
		}
		return {marker: marker, infoWindow: infoWindow};
	},

	createPolygon: function(paths, options) {
		return new Map.Polygon(paths, this.mapObj, options);
	},

	createCircle: function(center, radius, options) {
		return new Map.Circle(center, radius, this.mapObj, options);
	},

	createRectangle: function(bounds, options) {
		return new Map.Rectangle(bounds, this.mapObj, options);
	},

	createPolyLine: function(path, options) {
		return new Map.PolyLine(path, this.mapObj, options);
	},

	createOverlay: function(overlayOptions) {
		overlayOptions = (overlayOptions != undefined)? overlayOptions : {};
		var overlay = new Overlay(this.mapObj, overlayOptions);
	},

	createControl: function(tag, customControlOptions) {
		customControlOptions = (customControlOptions != undefined)? customControlOptions : {};
		customControlOptions.map = this.mapObj;
		var customControl = new CustomControl(tag, customControlOptions);
		return customControl;
	}

});