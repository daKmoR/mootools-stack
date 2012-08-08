/*
---

name: Flexo
description: simple inline editor
license: MIT-style license.
requires: [Core/Element.Style, More/Element.Forms]
provides: Flexo

...
*/

Element.implement({

	getSelection: function() {
		return $try(
			function() { return window.getSelection(); },
			function() { return document.getSelection(); },
			function() {
				var selection = document.selection && document.selection.createRange();
				if (selection.text) {
					return selection.text;
				}
				return false;
			}
		) || false;
	}

});

Object.extend({

	equals: function(obj1, obj2) {
		var property;
		obj2 = obj2 || this;
		for(property in obj2) {
			if(typeof(obj1[property])=='undefined') {return false;}
		}

		for(property in obj2) {
			if (obj2[property]) {
					switch(typeof(obj2[property]))	{
						case 'object':
							if (!obj2[property].equals(obj1[property])) { return false }; break;
						case 'function':
							if (typeof(obj1[property])=='undefined' || (property != 'equals' && obj2[property].toString() != obj1[property].toString())) { return false; }; break;
						default:
							if (obj2[property] != obj1[property]) { return false; }
					}
			}	else {
				if (obj1[property])	{
					return false;
				}
			}
		}

		for(property in obj1) {
			if(typeof(obj2[property])=='undefined') {return false;}
		}

		return true;
	}

});

var Flexo = new Class({
	Implements: [Options, Events],
	options: {
		submitOnEnterElements: ['a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span'],
		submitOnEnter: false
	},

	submitOnEnter: false,

	initialize: function(element, options) {
		if (!(this.element = document.id(element))) return false;
		this.setOptions(options);
		if (this.options.submitOnEnterElements.contains(this.element.get('tag')) === true || this.options.submitOnEnter === true) {
			this.submitOnEnter = true;
		}

		this.initPlugins();

		// this.element.addEvent('keyup', function() {
			// this.checkCarrotPosition();
		// }.bind(this) );

		this.element.addEvent('click', function() {
			this.activate();
		}.bind(this));

		this.element.addEvent('blur', function() {
			this.deactivate();
		}.bind(this));

		this.element.addEvent('keydown', function(event) {
			if (event.key == 'esc') {
				this.deactivateAndIgnoreChanges();
			}
			if (this.submitOnEnter === true && event.key == 'enter') {
				this.deactivate();
			}
		}.bind(this));
	},

	activate: function() {
		this.element.set('contentEditable', true);
		this.originalContent = this.element.get('html');
		this.element.focus();
	},

	deactivate: function() {
		this._deactivate(false);
	},

	deactivateAndIgnoreChanges: function() {
		this._deactivate(true);
	},

	_deactivate: function(dropChanges) {
		if (dropChanges === true) {
			this.element.set('html', this.originalContent);
		}
		if (dropChanges === false && this.element.get('html') !== this.originalContent) {
			this.element.fireEvent('change');
		}
		this.element.set('contentEditable', false);
		this.element.blur();
	},

	toElement: function() {
		return this.element;
	},

	getSelection: function() {
		if (window.getSelection) {
			return window.getSelection();
		}
		return window.getDocument().getSelection();
	},

	getRange: function() {
		var	range = this.getSelection().getRangeAt(0);
		if (!range) {
			range = window.document.createRange ? window.document.createRange() : window.document.body.createTextRange();
		}
		return range;
	},

	updateSelection: function(element) {
		var range = this.getRange(), text = range.toString();
		// range.deleteContents();
		// range.insertNode( new Element('strong', { html: text }) );
		range.surroundContents(element);
	},

	getElement: function() {
		var range = this.getRange(), element;

		if (range.setStart) {
			element = range.commonAncestorContainer;
			// if (!range.collapsed) {
				// if (range.startContainer == range.endContainer) {
					// if (range.startOffset - range.endOffset < 2) {
						// if (range.startContainer.hasChildNodes()) {
							// element = range.startContainer.childNodes[range.startOffset];
						// }
					// }
				// }
			// }
			if (element && element.nodeType == 3) {
				return element.parentNode;
			}
			return element;
		}
		return range.item ? range.item(0) : range.parentElement();
	},

	checkCarrotPosition: function() {
		Object.each(this.plugins, function(plugin) {
			plugin.checkCarrotPosition();
		}, this);
	},

	plugins: {},

	addPlugin: function(plugin) {

	},

	initPlugins: function() {
		this.plugins.Bold = new Flexo.Bold(this);
	}

});

Flexo.Bold = new Class({
	Implements: [Options, Events],
	options: {
		tag: 'strong',
		styles: {
			'font-weight': 'bold'
		},
		mode: 'spanStyle'
	},

	editor: null,

	initialize: function(editor, options) {
		this.editor = editor;
		this.setOptions(options);
	},

	checkCarrotPosition: function() {
		var element = this.editor.getElement();
		return this.isTag(element) || this.sameStyles(element);
	},

	activate: function() {
		if (this.options.mode === 'tag') {
			this.editor.updateSelection(new Element(this.options.tag));
		}
		if (this.options.mode === 'style') {
			this.editor.getElement().setStyles(this.options.styles);
		}
		if (this.options.mode === 'spanStyle') {
			this.editor.updateSelection( new Element('span', {styles: this.options.styles}) );
		}
	},

	deactivate: function() {

	},

	sameStyles: function(element) {
		var styles = element.getStyles(Object.keys(this.options.styles));
		return Object.equals(this.options.styles, styles);
	},

	isTag: function(element) {
		return element.get('tag') === this.options.tag;
	}

});