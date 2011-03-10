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
		url: '',
		onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
			this.setContent(responseHTML);
		}.bind(this)
	},
	
	subObjectMapping: {
		'this.infoWindowObj': {
			functions: ['close', 'getPosition', 'setOptions'],
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
		this.infoWindowObj.setPosition(point);
	},
	
	// MVC object is usually a marker.
	open: function(map, MVCObject) {
		this.infoWindowObj.open(map, MVCObject);
		if (this.options.url !== '') {
			this.getRequest({url: this.options.url}).send();
		}
	},
	
	getRequest: function(options) {
		var options = Object.merge(this.options, options);
		return this.request ? this.request.setOptions(options) : this.request = new Request.HTML(options);
	}

});