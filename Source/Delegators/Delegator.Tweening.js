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
			
			var toZeroElements = link.getElements(api.getAs(String, 'to-zero'));
			toZeroElements = toZeroElements.length === 0 ? link.getParent().getElements(api.getAs(String, 'to-zero')) : toZeroElements;
			toZeroElements = toZeroElements.length === 0 ? $$(api.getAs(String, 'to-zero')) : toZeroElements;
			toZeroElements.each(function(el) {
				el.store('Tweening:dimensions', el.getDimensions());
				el.setStyles({'display': 'block', 'overflow': 'hidden'});
				el.tween(property, 0);
			});
			
			var toOriginalElements = link.getElements(api.getAs(String, 'to-original'));
			toOriginalElements = toOriginalElements.length === 0 ? link.getParent().getElements(api.getAs(String, 'to-original')) : toOriginalElements;
			toOriginalElements = toOriginalElements.length === 0 ? $$(api.getAs(String, 'to-original')) : toOriginalElements;
			toOriginalElements.each(function(el) {
				var dimensions = el.retrieve('Tweening:dimensions', el.getDimensions());
				el.setStyle(property, 0);
				el.setStyles({'display': 'block', 'overflow': 'hidden'});
				el.tween(property, dimensions[property]);
			});
			
			var toggleElements = link.getElements(api.getAs(String, 'toggle'));
			toggleElements = toggleElements.length === 0 ? link.getParent().getElements(api.getAs(String, 'toggle')) : toggleElements;
			toggleElements = toggleElements.length === 0 ? $$(api.getAs(String, 'toggle')) : toggleElements;
			toggleElements.each(function(el) {
				var dimensions = el.retrieve('Tweening:dimensions', el.getDimensions());
				if (el.getStyle('display') === 'none') {
					el.setStyle(property, 0);
				}
				el.setStyles({'display': 'block', 'overflow': 'hidden'});
				if (el.getStyle(property).toInt() > 0) {
					el.tween(property, 0);
				} else {
					el.tween(property, dimensions[property]);
				}
				link.toggleClass(api.get('toggleClass'));
			});
		}
		
	});

})();

