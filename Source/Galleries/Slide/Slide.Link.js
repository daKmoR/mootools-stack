/*
---

name: Slide.Link
description: Slide Element for Slide
license: MIT-style license
authors:
  - Thomas Allmer
requires: [Slide.Element]
provides: [Slide.Link]

...
*/

Slide.Link = new Class({

	Extends: Slide.Element,

	options: {
		width: 200,
		height: 400
	},

	initialize: function (element, slide, options) {
		this.parent(element, slide, options);
	},

	show: function(callParent, noCall_in) {
		if (noCall_in !== true) {
			this._show(true);
		}
		if (callParent === true) {
			this.parent();
		}
	},

	_show: function(callIn) {
		if (callIn == true) {
			this.show(true);
		}
	}

});

Slide.implement({

	addLink: function(link, options) {
		return new Slide.Link(link, this, options);
	}

});