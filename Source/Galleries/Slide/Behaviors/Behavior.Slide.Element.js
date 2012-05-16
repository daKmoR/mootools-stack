/*
---
name: Behavior.Slide.Element
description: ...
provides: [Behavior.Slide.Element]
requires: [Behavior/Behavior, /Slide.Image, /Slide.Link.Request, /Behavior.Slide]
script: Behavior.Slide.Element.js

...
*/

Behavior.addGlobalFilter('Slide.Element', {

	defaults: {
		target: '![data-behavior="Slide"]',
		type: 'auto',
		isstartelement: false,
		width: null,
		height: null,
		requestfilter: null
	},

	setup: function(element, api) {
		var slide = element.getElement(api.getAs(String, 'target')).getBehaviorResult('Slide');
		var options = {
			isStartElement: api.getAs(Boolean, 'isstartelement')
		};
		if (api.getAs(Number, 'width') !== undefined) {
			options.width = api.getAs(Number, 'width');
		}
		if (api.getAs(Number, 'height') !== undefined) {
			options.height = api.getAs(Number, 'height');
		}
		if (api.getAs(String, 'requestfilter') !== undefined) {
			options.requestfilter = api.getAs(String, 'requestfilter');
		}

		var slideElement = slide.addElement(element, options);
		slideElement.addEvent('onLinkRequestLoaded', function(div) {
			api.applyFilters(div);
		});
		return slideElement;
	}

});