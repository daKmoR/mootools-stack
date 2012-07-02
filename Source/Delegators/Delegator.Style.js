/*
---
description: allow for simple styling of an element
provides: [Delegator.Style]
requires: [Behavior/Delegator, Core/Element]
script: Delegator.Style.js
name: Delegator.Style
...
*/

(function(){

	Delegator.register('click', 'Style', {

		require: ['target', 'property', 'value'],

		defaults: {
			setsize: false
		},

		handler: function(event, link, api) {
			link.getElements(api.getAs(String, 'target')).each(function(el) {
				if (api.getAs(Boolean, 'setsize') === true) {
					var properties = el.getDimensions();
					el.setStyle('width', properties['width']);
					el.setStyle('height', properties['height']);
				}
				el.setStyle(api.getAs(String, 'property'), api.getAs(String, 'value'));
			});
		}

	});

})();