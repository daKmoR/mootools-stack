/*
---
description: allow for simple styling of an element
provides: [Delegator.Styling]
requires: [Behavior/Delegator, Core/Element]
script: Delegator.Styling.js
name: Delegator.Styling
...
*/

(function(){

	Delegator.register('click', 'Styling', {
	
		defaults: {
			property: 'height'
		},
		
		handler: function(event, link, api) {
			link.getElements(api.getAs(String, 'target')).each(function(el) {
				el.setStyle(api.getAs(String, 'property'), api.getAs(String, 'value'));
			});
		}
		
	});

})();

