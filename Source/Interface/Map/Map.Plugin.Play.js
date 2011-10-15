/*
---

name: Map.Plugin.Play

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Thomas Allmer

requires: [Map, Map.Marker, Map.InfoWindow, Map.Rectangle]

provides: [Map.Plugin.Play]

...
*/

Map.implement({

	plugins: {
		play: {
			el: null,
			options: {},
			html: 'play',
			active: false,
			onClick: function(el) {
				if (!this.plugins.play.active) {
				
					
				
					el.set('text', 'pause');
					el.addClass('googleButtonActive');
					this.plugins.play.active = true;
				} else {
				
					el.set('text', 'play');
					el.removeClass('googleButtonActive');
					this.plugins.play.active = false;
				}
			}
		}
	}
	
});