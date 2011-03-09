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
		/*disableAutoPan: false,
		maxWidth: number,
		zIndex: number,*/
		pixelOffset: null,
		content: 'Content',
	},
	
	subObjectMapping: {
		'this.infoWindowObj': {
			properties: ['content', 'zIndex', 'position'],
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
	
	close: function() {
		this.infoWindowObj.close();
	},
	
	//MVC object is usually a marker.
	open: function(map, MVCObject) {
		this.infoWindowObj.open(map, MVCObject);
	}

});