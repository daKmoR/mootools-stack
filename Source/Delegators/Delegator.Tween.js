/*
---
description: Provides functionality for links that load content into a target element via ajax.
provides: [Delegator.Tween]
requires: [Behavior/Delegator, Core/Request.HTML, More/Spinner]
script: Delegator.Tween.js
name: Delegator.Tween
...
*/

(function(){

	Delegator.register('click', 'Tween', {

		defaults: {
			property: 'height',
			toggleClass: 'tweenToggle',
			setsize: false
		},

		handler: function(event, link, api) {
			var property = api.getAs(String, 'property');
			link.getElements(api.getAs(String, 'to-zero')).each(function(el) {
				var properties = el.getDimensions();
				if (api.getAs(Boolean, 'setsize') === true) {
					el.setStyle('width', properties['width']);
					el.setStyle('height', properties['height']);
				}
				if (api.getAs(String, 'styleproperty') !== '') {
					el.setStyle(api.getAs(String, 'styleproperty'), api.getAs(String, 'stylevalue'));
				}

				el.store('Tween:properties', properties);
				el.setStyles({'display': 'block', 'overflow': 'hidden'});
				el.tween(property, 0);
			});

			link.getElements(api.getAs(String, 'to-original')).each(function(el) {
				var properties = el.retrieve('Tween:properties', el.getDimensions());
				el.setStyle(property, 0);
				el.setStyles({'display': 'block', 'overflow': 'hidden'});
				el.tween(property, properties[property]);
			});

			link.getElements(api.getAs(String, 'toggle')).each(function(el) {
				var properties = el.retrieve('Tween:properties');
				if (!properties) {
					properties = el.getDimensions();
					if (!properties[property]) {
						properties[property] = el.getStyle(property);
					}
					el.store('Tween:properties', properties);
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

