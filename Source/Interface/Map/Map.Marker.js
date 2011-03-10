/*
---

name: Map.Marker

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Ciul
  - Thomas Allmer

requires: [Map]

provides: [Map.Marker]

...
*/

Map.Marker = new Class({
	Implements: [Options, Events, SubObjectMapping],

	options: {
		// use all options from http://code.google.com/apis/maps/documentation/javascript/reference.html#MarkerOptions
		visible: true,
	},
	
	subObjectMapping: {
		'this.markerObj': {
			functions: ['getPosition', 'setOptions'],
			properties: ['animation', 'clickable', 'cursor', 'draggable', 'flat', 'icon', 'map', 'shadow', 'shape', 'title', 'visible', 'zIndex'],
			eventInstance: 'google.maps.event',
			eventAddFunction: 'addListener',
			eventAddObjectAsParam: true,
			events: ['animation_changed', 'click', 'clickable_changed', 'cursor_changed', 'dblclick', 'drag', 'dragend', 'draggable_changed', 'dragstart', 'flat_changed', 'icon_changed', 'mousedown', 'mouseout', 'mouseover', 'mouseup', 'position_changed', 'rightclick', 'shadow_changed', 'shape_changed', 'title_changed', 'visible_changed', 'zindex_changed']
		}
	},

	markerObj: null,
	
	initialize: function (position, map, options) {
		this.setOptions(options);
		
		// we can't use position or map with options, as it is needed as a reference and not as a copy like setOptions would create it
		this.options.position = typeOf(position) === 'array' ? position.toLatLng() : position;
		this.options.map = map;
		
		this.markerObj = new google.maps.Marker(this.options);
		this.mapToSubObject();
	},
	
	hide: function() {
		this.setVisible(false);
	},

	show: function() {
		this.setVisible(true);
	},

	toggle: function() {
		if (this.getVisible()) {
			this.hide();
		} else {
			this.show();
		}
	},

	destroy: function() {
		this.setMap(null);
		this.markerObj = null;
	},
	
	/*------------------------- CUSTOM MAPPING METHODS -------------------------*/
	
	setPosition: function(point) {
		var point = typeOf(point) === 'array' ? point.toLatLng() : point;
		this.markerObj.setPosition(point);
	}

});

Map.implement({
	
	createMarker: function(position, options) {
		return new Map.Marker(position, this.mapObj, options);
	}

});