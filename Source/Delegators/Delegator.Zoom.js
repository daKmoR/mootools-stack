/*
---
description: allow for simple Zoom of an element
provides: [Delegator.Zoom]
requires: [Behavior/Delegator, Core/Element, Core/Cookie, PageZoom]
script: Delegator.Zoom.js
name: Delegator.Zoom
...
*/

(function(){

	Delegator.register('click', 'Zoom', {
	
		defaults: {
			to: 1
		},
		
		handler: function(event, link, api) {
			var to = api.getAs(Number, 'to');
			Cookie.write('Behavior::Zoom', to);
			Page.zoom(to);
		}
		
	});

})();