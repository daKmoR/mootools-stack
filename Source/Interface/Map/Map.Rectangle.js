/*
---

name: Map.Rectangle

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Map]

provides: [Map.Rectangle]

...
*/

Map.Rectangle = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		/*clickable: true,
		fillColor: '#000000',
		fillOpacity: 0.3,
		strokeColor: '#000000',
		strokeOpacity: 0.8,
		strokeWeight: 2
		zindex: number,*/

	},
	
	subObjectMapping: {
		'this.rectangleObj': {
			functions: ['bounds', 'map'],
			eventInstance: 'google.maps.event',
			eventAddFunction: 'addListener',
			events: ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseUp', 'rightclick']
		}
	},
		
	rectangleObj: null,
	
	initialize: function (bounds, map, options) {
		this.setOptions(options);
		
		// we can't use bounds or map with options, as it is needed as a reference and not as a copy like setOptions would create it
		this.options.bounds = (typeOf(bounds) === 'array' && bounds.length === 2) ? bounds.toLatLngBounds() : bounds;
		this.options.map = map;
		
		this.rectangleObj = new google.maps.Rectangle(this.options);
		this.mapToSubObject();
	},
	
	hide: function() {
		this.rectangleObj.setMap(null);
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
		this.rectangleObj.setMap(null);
		this.rectangleObj = null;
	}

});