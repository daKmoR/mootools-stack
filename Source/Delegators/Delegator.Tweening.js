/*
---
description: Provides functionality for links that load content into a target element via ajax.
provides: [Delegator.Tweening]
requires: [Behavior/Delegator, Core/Request.HTML, More/Spinner]
script: Delegator.Tweening.js
name: Delegator.Tweening
...
*/

(function(){

	Delegator.register('click', 'Tweening', {
	
		defaults: {
			property: 'height',
			toggleClass: 'tweeningToggle'
		},
		
		handler: function(event, link, api) {
			var property = api.getAs(String, 'property');
			
			link.getElements(api.getAs(String, 'to-zero')).each(function(el) {
				el.store('Tweening:properties', el.getDimensions());
				el.setStyles({'display': 'block', 'overflow': 'hidden'});
				el.tween(property, 0);
			});
			
			link.getElements(api.getAs(String, 'to-original')).each(function(el) {
				var properties = el.retrieve('Tweening:properties', el.getDimensions());
				el.setStyle(property, 0);
				el.setStyles({'display': 'block', 'overflow': 'hidden'});
				el.tween(property, properties[property]);
			});
			
			link.getElements(api.getAs(String, 'toggle')).each(function(el) {
				var properties = el.retrieve('Tweening:properties');
				if (!properties) {
					properties = el.getDimensions();
					if (!properties[property]) {
						properties[property] = el.getStyle(property);
					}
					el.store('Tweening:properties', properties);
				}
				var tmp = el.getStyle(property);
				el.setStyle(property, 'auto');
				var newDimensions = el.getDimensions();
				if (properties[property] !== newDimensions[property] && newDimensions[property] > 0) {
					properties = newDimensions;
				}
				el.setStyle(property, tmp);
				
				if (el.getStyle('display') === 'none' || el.getStyle('visibility') === 'hidden') {
					el.setStyle(property, 0);
				}
				if (isNaN(el.getStyle(property).toInt())) {
					el.setStyle(property, properties[property]);
				}
				el.setStyles({'display': 'block', 'overflow': 'hidden', 'visibility': 'visible'});
				if (el.getStyle(property).toInt() > 0) {
					if (property !== 'opacity') {
						el.tween(property, 0);
					} else {
						el.tween(property, 0).get('tween').chain(function() {
							el.setStyle('visibility', 'hidden');
						});
					}
				} else {
					el.tween(property, properties[property]);
				}
				link.toggleClass(api.get('toggleClass'));
			});
			
		}
		
	});

})();

