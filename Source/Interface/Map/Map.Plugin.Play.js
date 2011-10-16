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
				var animatedElements = this.getPolyLinesAnimated();
				if (!this.plugins.play.active) {
				
					if (!this.plugins.play.started) {
						animatedElements.each(function(animatedElement) {
							animatedElement.addEvent('onPointChange', function(lat, lng) {
								this.markers.each(function(marker) {
									if (marker.getPosition().invoke('round', 6).equalTo([lat, lng])) {
										marker.addEvent('onCloseclick', function() {
											animatedElement.resume();
										});
										marker.addEvent('onOpen', function(content) {
											var flexSlide = content.getElement('[data-behavior="FlexSlide"]').getBehaviorResult('FlexSlide');
											flexSlide.start();
										});
										marker.open();
										animatedElement.pause();
									}
								});
							}.bind(this));
						}, this);
						animatedElements.invoke('start');
						this.plugins.play.started = true;
					} else {
						animatedElements.invoke('resume');
					}
				
					el.set('text', 'pause');
					el.addClass('googleButtonActive');
					this.plugins.play.active = true;
				} else {
					animatedElements.invoke('pause');
				
					el.set('text', 'play');
					el.removeClass('googleButtonActive');
					this.plugins.play.active = false;
				}
			}
		}
	}
	
});