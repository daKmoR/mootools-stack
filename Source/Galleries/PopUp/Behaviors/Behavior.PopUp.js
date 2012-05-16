/*
---
name: Behavior.PopUp
description: Adds a slide interface (FlexPopUp instance)
provides: [Behavior.PopUp]
requires: [Behavior/Behavior, /PopUp, /Delegator.PopUpControls, /Behavior.Slide.Element]
script: Behavior.PopUp.js

...
*/

Behavior.addGlobalFilter('PopUp', {

	defaults: {
		width: null,
		height: null,
		requestfilter: null
	},

	setup: function(element, api) {
		var options = {};
		if (api.getAs(Number, 'width') !== undefined) {
			options.width = api.getAs(Number, 'width');
		}
		if (api.getAs(Number, 'height') !== undefined) {
			options.height = api.getAs(Number, 'height');
		}
		if (api.getAs(String, 'requestfilter') !== undefined) {
			options.requestfilter = api.getAs(String, 'requestfilter');
		}
		var popUp = new PopUp(element, Object.merge(options, {
			onBuild: function(wrap) {
				wrap.store('Behavior Filter result:' + 'PopUp', popUp);
				wrap.set('data-behavior', 'PopUp');
				api.applyFilters(wrap);
			}
		}));

		return popUp;
	}

});