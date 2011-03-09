/*
---

name: Map.Polygon

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Map]

provides: [Map.Polygon]

...
*/

Map.Polygon = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		/*clickable: true,
		fillColor: '#777777',
		fillOpacity: 0.8,
		geodesic: false,
		strokeColor: '#000000',
		strokeOpacity: 0.8,
		strokeWeight: 1,
		zIndex: number*/
	},
	
	subObjectMapping: {
		'this.polygonObj': {
			functions: ['map', 'path', 'paths'],
			eventInstance: 'google.maps.event',
			eventAddFunction: 'addListener',
			events: ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseUp', 'rightclick']
		}
	},

	polygonObj: null,

	initialize: function (paths, map, options) {
		this.setOptions(options);
		this.options.paths = typeOf(paths) === 'array' ? paths.toLatLng() : paths;
		this.options.map = map;
		
		this.polygonObj = new google.maps.Polygon(this.options);
		this.mapToSubObject();
	},
	
	hide: function() {
		this.polygonObj.setMap(null);
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
		this.polygonObj.setMap(null);
		this.polygonObj = null;
	}

});