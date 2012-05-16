/*
---

name: Slide.Link.Request
description: Slide Element for Slide
license: MIT-style license
authors:
  - Thomas Allmer
requires: [Slide.Link, Core/Request.HTML, More/Spinner]
provides: [Slide.Link.Request]

...
*/

Slide.Link.Request = new Class({

	Extends: Slide.Link,

	options: {
		width: 800,
		height: 600,
		setsSlideSize: true,
		isStartElement: true,
		requestfilter: ''
	},

	loaded: false,
	href: '',

	initialize: function (element, slide, options) {
		this.setOptions(options);
		this.href = element.get('href');
		this.element = element;

		var div = new Element('div', {'class': 'linkRequest'});
		div.setStyle('width', this.options.width);
		div.setStyle('height', this.options.height);
		div.replaces(this.element);
		this.element = div;

		this.request = new Request.HTML({
			method: 'get',
			autoCancel: true,
			url: this.href,
			filter: this.options.requestfilter,
			update: this.element,
			useSpinner: true,
			onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
				this.loaded = true;
				this.show(true, true);
				this.fireEvent('linkRequestLoaded', div);
			}.bind(this)
		});

		this.parent(this.element, slide, options);
	},

	_show: function() {
		this.request.send();
		this.request.getSpinner().element.setStyle('left', 0);
		this.request.getSpinner().element.setStyle('top', 0);
	}

});

Slide.implement({

	addLinkRequest: function(link, options) {
		return new Slide.Link.Request(link, this, options);
	}

});