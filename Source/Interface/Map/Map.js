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

var Map = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		mapOptions: {
			backgroundColor : '#ccc',
			center: [7.6, -74],
			disableDefaultUI: false,
			disableDoubleClickZoom: true,
			draggable: true,
			draggableCursor: 'cursor',
			draggingCursor: 'cursor',
			keyboardShortcuts: true,
			mapTypeId: 'roadmap',
			navigationControl: true,
			scaleControl: true,
			scrollwheel: true,
			streetViewControl: true,
			zoom: 6
		},
		size: {	width:  '100%', height: '100%' },
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
		//new Element('script', { type: "text/javascript", src: 'http://maps.google.com/maps/api/js?sensor=false'}).inject($$('head')[0], 'top');
		this.mapContainer = $(mapContainer);
		this.setOptions(options);
		
		this.createMap();
		
		this.mapToSubObject();
		/*
		bounds_changed:     This event is fired when the viewport bounds have changed.
		center_changed:     This event is fired when the map center property changes.
		click:              This event is fired when the user clicks on the map (but not when they click on a marker or infowindow).
		dblclick:           This event is fired when the user double-clicks on the map. Note that the click event will also fire, right before this one.
		drag:               This event is repeatedly fired while the user drags the map.
		dragend:            This event is fired when the user stops dragging the map.
		dragstart:          This event is fired when the user starts dragging the map.
		idle:               This event is fired when the map becomes idle after panning or zooming.
		maptypeid_changed:	This event is fired when the mapTypeId property changes.
		mousemove:          This event is fired whenever the user's mouse moves over the map container.
		mouseout:           This event is fired when the user's mouse exits the map container.
		mouseover:          This event is fired when the user's mouse enters the map container.
		projection_changed: This event is fired when the projection has changed.
		resize:             Developers should trigger this event on the map when the div changes size: google.maps.event.trigger(map, 'resize').
		rightclick:         This event is fired when the DOM contextmenu event is fired on the map container.
		maptypeid_changed:  This event is fired when the visible tiles have finished loading.
		zoom_changed:       This event is fired when the map zoom property changes.
		*/
		
		this.createMarker([7.6, -74]);
		
		//this.createInfoMarker({position: new google.maps.LatLng(7.6,-74)});
	},

	createMap: function() {
		// this.mapContainer.setStyles({
			// width:  this.options.size.width,
			// height: this.options.size.height
		// });
		
    var latlng = new google.maps.LatLng(7.6, -74);
		//this.createLatLng(this.options.center.lat, this.options.center.lng)
		
		this.options.mapOptions.center = latlng;
		this.options.mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
	
		this.mapObj = new google.maps.Map(this.mapContainer, this.options.mapOptions);
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

	createMarker: function(position, markerOptions) {
		markerOptions = markerOptions || {};
		markerOptions.map = this.mapObj;
		return new Map.Marker(position, markerOptions);
	},

	// Possible to define a different Marker Event (action) than 'click'
	// to trigger the opening of the infoWindow. See Marker Class>>EVENTS (ln 724).
	createInfoMarker: function(markerOptions, infoWindowOptions, action, opened, delay) {
		action = [action, 'click'].pick();
		// Checks for opened option to be passed or not.
		if(!typeOf(opened) == 'boolean') {
			// Closed by default.
			opened = false;
		}
		var marker = new Marker(markerOptions);
		var infoWindow = new InfoWindow(infoWindowOptions);
		marker.addEvent(action, function() {
			infoWindow.open(this.mapObj, marker.markerObj);
		}.bind(this));
		marker.setMap(this.mapObj);
		if(opened) {
			if(!typeOf(delay) == 'number') {
				delay = 250;
			}
			marker.fireEvent(action, null, delay);
		}
		return {marker: marker, infoWindow: infoWindow};
	},

	createPolygon: function(polygonOptions) {
		polygonOptions = (polygonOptions != undefined)? polygonOptions : {};
		polygonOptions.map = this.mapObj;
		return new Polygon(polygonOptions);
	},

	createCircle: function(circleOptions) {
		circleOptions = (circleOptions != undefined)? circleOptions : {};
		circleOptions.map = this.mapObj;
		var circle = new Circle(circleOptions);
		return circle;
	},

	createRectangle: function(rectangleOptions) {
		rectangleOptions = (rectangleOptions != undefined)? rectangleOptions : {};
		rectangleOptions.map = this.mapObj;
		var rectangle = new Rectangle(rectangleOptions);
		return rectangle;
	},

	/*  
	Creates a PolyLine on the map.
	Coordinates is an array of [lat,lng]
	e.g, coordinates: [[lat,lng], [lat2, lng2], [lat3,lng3],...so on]
	*/
	createPolyLine: function(coordinates, polyLineOptions) {
		polyLineOptions = (polyLineOptions != undefined)? polyLineOptions : {};
		polyLineOptions.map = this.mapObj;
		var polyLine = new PolyLine(polyLineOptions);
		if(coordinates && (typeOf(coordinates) == 'array') ) {
			coordinates.each(function(latLng) {
				var lat = latLng[0];
				var lng = latLng[1];
				latLng = new google.maps.LatLng(lat, lng);
				polyLine.addLine(latLng);
			}, this);
		};
		return polyLine;
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