/*
---

name: Slide.Image
description: Slide Element for Slide
license: MIT-style license
authors:
  - Thomas Allmer
requires: [Slide.Element]
provides: [Slide.Image]

...
*/

Slide.Image = new Class({

	Extends: Slide.Element,

	options: {
		width: 'auto',
		height: 'auto'
	},

	initialize: function (image, slide, options) {
		this.setOptions(options);
		this.setSize(image);
		this.parent(image, slide, options);
	},

	setSize: function(image) {
		if (this.options.width === 'auto') {
			this.options.width = image.get('width').toInt();
		}
		if (this.options.height === 'auto') {
			this.options.height = image.get('height').toInt();
		}
	}

});

Slide.implement({

	addImage: function(image, options) {
		return new Slide.Image(image, this, options);
	}

});