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
		infoWindowOptions: {
			/*content: 'Content',
			disableAutoPan: false,
			maxWidth: number,
			zIndex: number,*/
			pixelOffset: new google.maps.Size(10,10)
		},		
		mapToSubObject: {
			'this.infoWindowObj': {
				functions: ['content', 'zIndex', 'position'],
				eventInstance: 'google.maps.event',
				eventAddFunction: 'addListener',
				events: ['closeclick', 'content_changed', 'domready', 'position_changed', 'zindex_changed']
			}
		}
	},

	infoWindowObj: null,

	initialize: function (position, options) {
		this.options.infoWindowOptions.position = new google.maps.LatLng(position[0], position[1]);
		this.setOptions(options);
		
		this.infoWindowObj = new google.maps.InfoWindow(this.options.infoWindowOptions);
		
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