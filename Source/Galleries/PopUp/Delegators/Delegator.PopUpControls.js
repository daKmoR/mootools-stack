/*
---
description: ...
provides: [Delegator.PopUpControls]
requires: [Behavior/Delegator, Core/Element, /PopUp]
script: Delegator.PopUpControls.js
name: Delegator.PopUpControls
...
*/

(function(){

	Delegator.register('click', 'PopUp.Open', {

		defaults: {
			target: ''
		},

		handler: function(event, link, api) {
			event.stop();
			var target = api.getAs(String, 'target') === '' ? link : link.getElement(api.getAs(String, 'target'));
			var popUp = target.getBehaviorResult('PopUp');
			popUp.open();

			return popUp;
		}

	});

	Delegator.register('click', 'PopUp.Close', {

		defaults: {
			target: '![data-behavior="PopUp"]'
		},

		handler: function(event, link, api) {
			event.stop();
			var target = api.getAs(String, 'target') === '' ? link : link.getElement(api.getAs(String, 'target'));
			var popUp = target.getBehaviorResult('PopUp');
			popUp.close();

			return popUp;
		}

	});

})();