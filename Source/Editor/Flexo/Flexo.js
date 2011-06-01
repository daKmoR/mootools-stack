/*
---

name: Flexo

description: simple inline editor 

license: MIT-style license.

requires: [Core/Element.Dimensions, Core/Element.Style, Core/Fx.Tween, Core/Fx.Morph, Core/Fx.Transitions, More/Fx.Elements, More/Scroller, More/Element.Position, More/Element.Forms, Class.Settings]

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
				if(selection.text) { return selection.text; }
				return false;
			}
		) || false;
	}
	
});

Object.extend({

	equals: function(obj1, obj2) {
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
	Implements: [Settings, Events],
	options: {

	},
	
	initialize: function(wrap, options) {
		if( !(this.wrap = $(wrap)) ) return;
		this.setOptions(options);
		
		this.initPlugins();
		
		this.wrap.getElements('a').addEvent('click', function(e) {
			e.stop();
		});
		
		this.wrap.addEvent('mouseup', function() {
			this.activate();
			//console.log( this.wrap.getSelectedText() );
			
			//this.wrap.selectRange(1, 100);
			var tmp = this.getElement();
			console.log(tmp);
			
			//this.wrapSelection('<strong>|</strong>');
		}.bind(this) );
		
		this.wrap.addEvent('keyup', function() {
			this.checkCarrotPosition();
		}.bind(this) );
		
		
		$('in').addEvent('mouseup', function() {
			//console.log( $('in').getSelectedText() );
		});
		
		
		$('useMe').addEvent('mouseenter', function() {
			//console.log( 'mouse ' + this.wrap.getCaretPosition() );
			
			this.plugins.Bold.activate();
			
		}.bind(this) );
		
	},
	
	activate: function() {
		this.wrap.set('contentEditable', true);
	},
	
	deactivate: function() {
		this.wrap.set('contentEditable', false);
	},
	
	toElement: function() {
		return this.wrap;
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
		range.surroundContents( element );
	},
	
	getElement: function() {
		var range = this.getRange(), element;
		
		if (range.setStart) {
			
			element = range.commonAncestorContainer;
			
			// console.log(element);
		
			// if (!range.collapsed) {
				// if (range.startContainer == range.endContainer) {
					// if (range.startOffset - range.endOffset < 2) {
						// if (range.startContainer.hasChildNodes()) {
							// element = range.startContainer.childNodes[range.startOffset];
						// }
					// }
				// }
			// }
			
			if (element && element.nodeType == 3)
				return element.parentNode;
			
			return element;
		}
		
		return range.item ? range.item(0) : range.parentElement();
	},
	
	checkCarrotPosition: function() {
		console.log(this.getElement());
		
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
	Implements: [Settings, Events],
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
		if (this.isTag(element) || this.sameStyles(element)) {
			return true;
		}
		return false;
	},
	
	activate: function() {
		if (this.options.mode === 'tag') {
			this.editor.updateSelection( new Element(this.options.tag) );
		}
		if (this.options.mode === 'style') {
			this.editor.getElement().setStyles(this.options.styles);
		}
		if (this.options.mode === 'spanStyle') {
			this.editor.updateSelection( new Element('span', {styles: this.options.styles}) );
		}
	},
	
	deaktivate: function() {
		
	},
	
	sameStyles: function(element) {
		var styles = element.getStyles( Object.keys(this.options.styles) );
		return Object.equals(this.options.styles, styles);
	},
	
	isTag: function(element) {
		return element.get('tag') === this.options.tag;
	}
	
});