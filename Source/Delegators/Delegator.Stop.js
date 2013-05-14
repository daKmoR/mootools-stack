/*
---
description: Stops the event
provides: [Delegator.Stop]
requires: [Behavior/Delegator, Core/Element]
script: Delegator.Stop.js
name: Delegator.Stop
...
*/

(function(){

	Delegator.register('click', 'Stop', {
		handler: function(event, link, api) {
			event.stop();
		}
	});

})();