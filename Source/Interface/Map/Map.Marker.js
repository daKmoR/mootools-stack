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
		/*clickable: true,
		cursor: '',
		draggable: false,
		flat: false,
		icon: '',
		raiseOnDrag: true,
		shadow: '',
		title: 'Marker Title',
		visible: true,
		zIndex: number*/
		mapToSubObject: {
			'this.markerObj': {
				functions: ['clickable', 'cursor', 'draggable', 'flat', 'icon', 'map', 'position', 'shadow', 'shape', 'title', 'visible', 'zIndex'],
				eventInstance: 'google.maps.event',
				eventAddFunction: 'addListener',
				events: ['click', 'clickable_changed', 'cursor_changed', 'dblclick', 'drag', 'dragend', 'draggable_changed', 'dragstart', 'flat_changed', 'icon_changed', 'mousedown', 'mouseout', 'mouseover', 'mouseup', 'position_changed', 'rightclick', 'shadow_changed', 'shape_changed', 'title_changed', 'visible_changed', 'zindex_changed']
			}
		}
	},

	markerObj: null,
	
	initialize: function (position, map, options) {
		this.setOptions(options);
		
		// we can't use position or map with options, as it is needed as a reference and not as a copy like setOptions would create it
		this.options.position = typeOf(position) === 'array' ? new google.maps.LatLng(position[0], position[1]) : position;
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
		this.markerObj.setMap(null);
		this.markerObj = null;
	}

});