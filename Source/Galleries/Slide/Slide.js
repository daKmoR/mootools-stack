/*
---

name: Slide
description: allows to create almost any Sliding Stuff (Galleries, Tabs...) with multiple effects [CSS:Stack/Source/Galleries/Slide/Css/SlideBase.css]
license: MIT-style license.
requires: [Core/Element.Dimensions, Core/Element.Style, Core/Fx.Tween, Core/Fx.Morph, Core/Fx.Transitions, More/Fx.Elements, More/Scroller, More/Fx.Scroll, More/Element.Position, More/Assets, More/URI, /Gallery]
provides: Slide

...
*/

var Slide = new Class({

	Extends: Gallery,

	options: {
		mode: 'repeat', /* [repeat, reverse, random, once] */
		step: 1,
		times: 1,
		positionContainer: false,
		container: null,
		containerPosition: null //{ position: 'center' }
	},

	_elements: [],

	initialize: function(wrap, options) {
		if (!(this.wrap = document.id(wrap))) return;
		this.parent(options);
		this.build();
		//this.start.delay(1000, this);
	},

	build: function() {
		this.wrap.addClass('slideWrap');
		this.elements = new Element('div', {'class': 'slideElements'});
		this.wrap.grab(this.elements);

		this.container = this.wrap.getParent();
	},

	setSize: function(size) {
		this.elements.setStyle('width', size.x);
		this.elements.setStyle('height', size.y);
	},

	show: function(element, fxGroup) {
		element = typeOf(element) === 'number' ? this._elements[element] : element;
		if (this.currentElement && this.currentElement !== element) {
			this.currentElement.hide();
//			this.currentElement.hide().chain(
//				function() { element.show(); }
//			);
		}
		if (this.currentElement !== element) {
			element.show();
		}
		if (this.options.containerPosition !== null) {
			this.container.position();
		}

		this.fireEvent('show', 'showing...');
		this.currentElement = element;
		this.parent();
	},

	next: function(times) {
		this.currentElement = !this.currentElement ? this.lastAddedElement : this.currentElement;
		var nextElement = this.currentElement.getNextElement();
		if (this.options.mode === 'repeat' && nextElement == null) {
			nextElement = this._elements[0];
		}
		if (nextElement) {
			this.show(nextElement);
		}
	},

	guessElementType: function(element) {
		switch (element.get('tag')) {
			case 'img':
				return 'Image';
			case 'p':
			case 'span':
			case 'div':
				return 'Div';
		}

		if (element.get('tag') === 'a') {
			var href = element.get('href');
			var fileExt = href.substr(href.lastIndexOf('.') + 1).toLowerCase();
			switch (fileExt) {
				case 'jpg':
				case 'gif':
				case 'png':
					return 'Link.Image';
				case 'swf':
					return 'Link.Flash';
				case 'flv':
					return 'Link.FlashVideo';
				case 'mov':
					return 'Link.QuickTime';
				case 'wmv':
					return 'Link.WindowsMedia';
				case 'rv':
				case 'rm':
				case 'rmvb':
					return 'Link.RealMedia';
				case 'mp3':
					return 'Link.FlashMp3';
				default:
					if (href.charAt(0) === '#') {
						return 'Link.Inline';
					} else if (document.location.host === href.toURI().get('host') + (document.location.host.contains(':') ? ':' + href.toURI().get('port') : '')) {
						return 'Link.Request';
					} else if (href.contains('youtube.com') || href.contains('youtu.be')) {
						return 'Link.YouTube';
					} else {
						return 'Link.Iframe';
					}
			}
		}
	}


});
