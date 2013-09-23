/*
---
description: Provides methods to add/remove/toggle a class on a given target.
provides: [Delegator.class-toggle, Delegator.class-add, Delegator.class-remove, Delegator.class]
requires: [Behavior/Delegator, Core/Element]
script: Delegator.class.js
name: Delegator.class

...
*/
(function(){

	var triggers = {};

	['add', 'remove', 'toggle'].each(function(action){

		triggers['class-' + action] = {
			require: ['class'],
			handler: function(event, link, api){
				var target = link;
				if (api.get('target')) {
					target = link.getElement(api.get('target'));
					if (!target) api.fail('could not locate target element to ' + action + ' its class', link);
				}
				target[action + 'Class'](api.get('class'));
			}
		};

	});

	Delegator.register('click', triggers);

})();