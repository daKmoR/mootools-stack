/*
---

name: Map.Circle

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Map]

provides: [Map.Circle]

...
*/

Map.Circle = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		/*clickable: true,
		fillColor: '#000000',
		fillOpacity: 0.3,
		strokeColor: '#000000',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		zIndex: number,*/
		mapToSubObject: {
			'this.circleObj': {
				functions: ['center', 'map', 'radius', 'flat', 'icon', 'map', 'position', 'shadow', 'shape', 'title', 'visible', 'zIndex'],
				eventInstance: 'google.maps.event',
				eventAddFunction: 'addListener',
				events: ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseUp', 'rightclick']
			}
		}
	},

	circleObj: null,

	initialize: function (center, radius, map, options) {
		this.setOptions(options);

		this.options.center = typeOf(center) === 'array' ? new google.maps.LatLng(center[0], center[1]) : center;
		this.options.map = map;
		this.options.radius = radius;
		
		this.circleObj = new google.maps.Circle(this.options);
		
		this.mapToSubObject();
	},
	
	getBounds: function() {
		return this.circleObj.getBounds();
	},
	
	hide: function() {
		this.circleObj.setMap(null);
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
		this.circleObj.setMap(null);
		this.circleObj = null;
	}	

});