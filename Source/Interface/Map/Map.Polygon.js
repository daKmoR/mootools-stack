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
		polygonOptions: {
			/*clickable: true,
			fillColor: '#777777',
			fillOpacity: 0.8,
			geodesic: false,
			map: null,
			paths: [], // For simple use, pass a Mx2 array [[lat,lng],[...[lat,lng]]]
			strokeColor: '#000000',
			strokeOpacity: 0.8,
			strokeWeight: 1,
			zIndex: number*/
		},		
		mapToSubObject: {
			'this.polygonObj': {
				functions: ['map', 'path', 'paths'],
				eventInstance: 'google.maps.event',
				eventAddFunction: 'addListener',
				events: ['click', 'dblclick', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseUp', 'rightclick']
			}
		}
	},

	polygonObj: null,

	initialize: function (paths, options) {
		this.options.polygonOptions.paths = this.pathsArrayToMVCArray(paths);
		this.setOptions(options);
		
		this.polygonObj = new google.maps.Polygon(this.options.polygonOptions);
		this.mapToSubObject();
	},
	
	pathsArrayToMVCArray: function(paths) {
		// If you don't pass a Mx2 array make sure you pass a correct paths arguments
		// according to Google Maps Api documentation.
		if (paths.flatten().length == 2*paths.length) {
			var mvcPathsArray = new google.maps.MVCArray();
			paths.each(function(item, index) {
				if(typeOf(item) == 'array' && typeOf(item[0]) == 'number' && typeOf(item[1]) == 'number' && item.length == 2) {
					// This will convert each [lat,lng] you pass to a google.maps.LatLng object.
					var latLng = new google.maps.LatLng(item[0], item[1]);
					mvcPathsArray.push(latLng);
				}
			}, this);
			this.options.polygonOptions.paths = mvcPathsArray;
		}
		return mvcPathsArray || paths;
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