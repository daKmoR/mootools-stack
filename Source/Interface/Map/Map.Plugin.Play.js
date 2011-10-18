/*
---

name: Map.Plugin.Play

description: Google Maps with MooTools

license: MIT-style license

authors:
  - Thomas Allmer

requires: [Map, Map.Marker, Map.InfoWindow, Map.Rectangle, More/Events.Pseudos]

provides: [Map.Plugin.Play]

...
*/

Map.implement({

	plugins: {
		play: {
			element: null,
			options: {},
			html: 'play',
			active: false,
			init: function(marker) {
				this.addEvent('markerAdded', function(marker) {
					marker.addEvent('open', function(content) {
						var slide = content.getElement('[data-behavior="Slide"]').getBehaviorResult('Slide');
						slide.options.active = true;
						slide.start();
					});
					
					marker.addEvent('content_changed', function(content) {
						var slide = marker.wrap.getElement('[data-behavior="Slide"]').getBehaviorResult('Slide');
						slide.addEvent('finished', function() {
							slide.options.active = false;
							(function() { slide.show(0); }).delay(500);
							marker.close();
						});
					});
				});
			},
			onClick: function(element) {
				var animatedElements = this.getPolyLinesAnimated();
				if (!this.plugins.play.active) {
				
					if (!this.plugins.play.started) {
						this.plugins.play.initAnimation.call(this, animatedElements);
						animatedElements.invoke('start');
						this.plugins.play.started = true;
					} else {
						animatedElements.invoke('resume');
					}
				
					element.set('text', 'pause');
					element.addClass('googleButtonActive');
					this.plugins.play.active = true;
				} else {
					animatedElements.invoke('pause');
				
					element.set('text', 'play');
					element.removeClass('googleButtonActive');
					this.plugins.play.active = false;
				}
			},
			initAnimation: function(animatedElements) {
				animatedElements.each(function(animatedElement) {
					animatedElement.addEvent('onPointChange', function(lat, lng) {
						this.markers.each(function(marker) {
							if (marker.getPosition().invoke('round', 6).equalTo([lat, lng])) {
								var close = function() {
									(function() { animatedElement.resume(); }).delay(500);
								};
								marker.addEvent('closeclick:once', close);
								
								var slide = marker.wrap.getElement('[data-behavior="Slide"]').getBehaviorResult('Slide');
								slide.addEvent('finished:once', close);
								
								marker.open();
								animatedElement.pause();
							}
						});
					}.bind(this));
				}, this);
			}
		}
	}
	
});