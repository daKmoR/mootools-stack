/*
---

name: Map.InfoWindow

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Map]

provides: [Map.InfoWindow]

...
*/

Map.InfoWindow = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		// use all options from http://code.google.com/apis/maps/documentation/javascript/reference.html#InfoWindowOptions
		content: 'pls provide your content with the options',
	},
	
	subObjectMapping: {
		'this.infoWindowObj': {
			functions: ['close', 'getPosition', 'open', 'setOptions'],
			properties: ['content', 'zIndex'],
			eventInstance: 'google.maps.event',
			eventAddFunction: 'addListener',
			events: ['closeclick', 'content_changed', 'domready', 'position_changed', 'zindex_changed']
		}
	},

	infoWindowObj: null,

	initialize: function (position, options) {
		this.setOptions(options);
		
		this.options.position = typeOf(position) === 'array' ? position.toLatLng() : position;
		//this.options.pixelOffset = new google.maps.Size(10,10);
		
		this.infoWindowObj = new google.maps.InfoWindow(this.options);
		
		this.mapToSubObject();
	},
	
	/*------------------------- CUSTOM MAPPING METHODS -------------------------*/
	
	setPosition: function(point) {
		var point = typeOf(point) === 'array' ? point.toLatLng() : point;
		this.markerObj.setPosition(point);
	}

});