/*
---

name: Select

description: asdf

license: MIT-style license.

requires: [Core/Element.Dimensions, Core/Element.Style, Core/Fx.Tween, Core/Fx.Morph, Core/Fx.Transitions, More/Fx.Elements, More/Scroller, More/Element.Position, Class.Settings, Gallery]

provides: Select

...
*/ 

var Select = new Class({
	Implements: [Settings, Events],
	options: {
		selections: {
			option: 'option'
		},
		render: ['status', {'options': ['option']}],
		ui: {
			wrap: { 'class': 'select' },
			activeClass: 'ui-active'
		},
		single: {
			statusTemplate: '{element}'
		},
		multiple: {
			statusTemplate: '{count} Elemente ausgewählt'
		},
		mode: 'single',
		caseSensitive: false
	},
	
	current: -1,
	elements: {},
	isOpen: false,
	
	initialize: function(select, options) {
		if (!(this.select = $(select))) return;
		if (this.select.get('multiple') === true) {
			this.options.mode = 'multiple';
		}
		this.setOptions(options);
		
		this.build();
	},
	
	build: function() {
		this.wrap = new Element('div', this.options.ui.wrap);
		this.wrap.setStyles({ width: this.select.getSize().x, height: this.select.getSize().y});
		this.wrap.inject(this.select, 'after');
		
		this.builder( this.options.render, this.wrap );
		
		this.statusWrap.addEvent('click', function() {
			this.statusWrap.set('value', '');
			this.filter(this.statusWrap.get('value'));
			this.toggle();
		}.bind(this));
		
		this.statusWrap.addEvent('keyup', function(e) {
			if (e.key != 'enter' && e.key != 'up' && e.key != 'down' && e.key != 'esc') {
				this.filter(this.statusWrap.get('value'));
				this.open();
			}
		}.bind(this));
		
		this.statusWrap.addEvent('keydown', function(e) {
			if (e.key === 'down') {
				this.currentDown();
			}
			if (e.key === 'up') {
				this.currentUp();
			}
			if (e.key === 'enter') {
				e.stop();
				this.selectOption(this.current);
			}
			if (e.key === 'esc') {
				this.statusWrap.blur();
				this.close();
			}
		}.bind(this));
		
		this.elements.optionCopy.each(function(el) {
			el.addEvent('click', function(e) {
				e.stop();
				this.selectOption(el);
				this.statusWrap.focus();
			}.bind(this));
			el.addEvent('mouseenter', function(e) {
				this.setCurrent(el);
			}.bind(this));
		}, this);
		
		this.fireEvent('onBuild');
	},
	
	currentNext: function(add) {
		var i = this.current + add;
		while (i != this.current) {
			i = i > this.elements.optionCopy.length-1 ? 0 : i;
			i = i < 0 ? this.elements.optionCopy.length-1 : i;
			
			if (this.elements.optionCopy[i].getStyle('display') === 'block') {
				this.setCurrent(i);
				return;
			}
			i = i + add;
		}
	},
	
	currentUp: function() {
		this.currentNext(-1);
	},
	
	currentDown: function() {
		this.currentNext(1);
	},
	
	setCurrent: function(mixed) {
		i = Type.isNumber(mixed) ? mixed : this.elements.optionCopy.indexOf(mixed);
		el = Type.isObject(mixed) ? mixed : this.elements.optionCopy[i];
	
		this.current = i;
		this.elements.optionCopy.invoke('removeClass', 'ui-current');
		this.elements.optionCopy[i].addClass('ui-current');
	},
	
	selectOption: function(mixed) {
		this.current = Type.isNumber(mixed) ? mixed : this.elements.optionCopy.indexOf(mixed);
		el = Type.isElement(mixed) ? mixed : this.elements.optionCopy[mixed];
	
		if (this.options.mode === 'single') {
			this.elements.optionCopy.invoke('removeClass', this.options.ui.activeClass);
		}
		el.addClass(this.options.ui.activeClass);
		if (this.options.mode === 'single') {
			this.close();
		}
	},
	
	synch: function(mode) {
		this.activeEls = this.elements.optionCopy.filter(function(item) { return item.hasClass(this.options.ui.activeClass); }.bind(this));
		var mode = mode || 'to';
		if (mode === 'to') {
			this.elements.optionCopy.each(function(el, i) {
				if (el.hasClass(this.options.ui.activeClass)) {
					this.elements.option[i].set('selected', 'selected');
				}
			}, this);
		} else if (mode === 'from') {
			this.elements.option.each(function(el, i) {
				if (el.get('selected') === 'selected') {
					this.elements.optionCopy[i].addClass(this.options.ui.activeClass);
				}
			}, this);
		}
	},
	
	filter: function(text) {
		this.elements.optionCopy.invoke('setStyle', 'display', 'block');
		
		this.elements.optionCopy.filter(function(item) {
			if (this.options.caseSensitive) {
				return !item.text.contains(text);
			}
			return !item.text.toLowerCase().contains(text.toLowerCase())
		}.bind(this)).invoke('setStyle', 'display', 'none');
	},
	
	setStatus: function(status) {
		this.statusWrap.set('value', status);
	},
	
	open: function() {
		this.optionsWrap.tween('height', this.optionWrap.getSize().y);
		this.isOpen = true;
	},

	close: function() {
		this.synch();
		var text = '';
		if (this.activeEls.length == 1) {
			text = this.options.single.statusTemplate.substitute({element: this.activeEls[0].get('text'), count: this.activeEls.length});
		}
		if (this.activeEls.length > 1) {
			elements = this.activeEls.invoke('get', 'text').join(', ');
			text = this.options.multiple.statusTemplate.substitute({element: this.activeEls[0].get('text'), elements: elements, count: this.activeEls.length});
		}
		this.setStatus(text);
		this.optionsWrap.tween('height', 0);
		this.isOpen = false;
	},
	
	toggle: function() {
		if (!this.isOpen) {
			this.open();
		} else {
			this.close();
		}
	},	
	
	buildElement: function(item, wrapper) {
		if( !$chk(this.options.ui[item]) )
			this.options.ui[item] = { 'class': 'ui-' + item.capitalize() };
		if( !$chk(this.options.selections[item]) )
			this.options.selections[item] = '.' + item;
			
		this.elements[item] = this.select.getElements( this.options.selections[item] );
		this[item + 'Wrap'] = new Element('div', this.options.ui[item]);
		if (item === 'status') {
			this[item + 'Wrap'] = new Element('input', this.options.ui[item]);
		}
		this[item + 'Wrap'].inject( wrapper );
		
		if( this.elements[item].length > 0 ) {
			this.elements[item + 'Copy'] = [];
			this.elements[item].each( function(el, i) {
				if( !$chk(this.options.ui[item + 'Item']) )
					this.options.ui[item + 'Item'] = { 'class': 'ui-' + item.capitalize() + 'Item' };
				this.elements[item + 'Copy'][i] = new Element('a', { 'href': '#', 'html': el.get('html'), 'class': this.options.ui[item + 'Item']['class'] })
				this[item + 'Wrap'].grab(this.elements[item + 'Copy'][i]);
			}, this);
		}
	},
	
	builder: function(els, wrapper) {
		$each( els, function(item, i) {
			if( $type(item) !== 'object' ) {
				this.buildElement(item, wrapper);
			} else {
				$each( item, function(el, i) {
					this.buildElement(i, wrapper);
					this.builder(el, this[i + 'Wrap']);
				}, this);
			}
		}, this);
	},
	
	toElement: function() {
		return this.wrap;
	}
	
});