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

	var triggers = {};

	['Style', 'Style1', 'Style2', 'Style3'].each(function(action) {

		triggers[ action] = {

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

		};

	});

	Delegator.register('click', triggers);

})();