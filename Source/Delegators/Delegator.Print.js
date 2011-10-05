/*
---
description: print the document
provides: [Delegator.Print]
requires: [Behavior/Delegator, Core/Element]
script: Delegator.Print.js
name: Delegator.Print
...
*/

(function(){

	Delegator.register('click', 'Print', {
		handler: function(event, link, api) {
			event.stop();
			window.print();
		}
	});

})();