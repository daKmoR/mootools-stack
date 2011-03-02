/*
---

name: Select

description: asdf

license: MIT-style license.

requires: [Core/Element.Dimensions, Core/Element.Style, More/String.Extras, Class.Settings, Element.OuterClick]

provides: Select

...
*/ 

var Select = new Class({
	Implements: [Settings, Events],
	options: {
		selections: {
			option: 'option'
		},
		render: ['status', 'option'],
		ui: {
			wrap: { 'class': 'select' },
			activeClass: 'ui-active',
			searchMarkClass: 'ui-SearchMark',
			defaultStatusClass: 'ui-defaultStatus'
		},
		single: {	statusTemplate: '{element}'	},
		multiple: {	statusTemplate: '({count}) {elements}', statusElementsTruncate: { length: 22, trail: '...' } },
		mode: 'single',
		defaultStatus: '',
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
		if (this.select.get('title') !== '') {
			this.options.defaultStatus = this.select.get('title');
		}
		
		this.setOptions(options);
		
		this.build();
		this.synch('fromSelect');
		
		this.wrap.addEvent('outerClick', function() {
			this.close();
		}.bind(this));
		
		this.setStatus();
	},
	
	build: function() {
		this.wrap = new Element('div', this.options.ui.wrap);
		this.wrap.inject(this.select, 'after');
		
		this.builder( this.options.render, this.wrap );
		
		this.statusWrap.addEvent('click', function() {
			this.statusWrap.set('value', '');
			this.statusWrap.removeClass(this.options.ui.defaultStatusClass);
			this.filter(this.statusWrap.get('value'));
			this.toggle();
		}.bind(this));
		
		this.statusWrap.addEvent('keyup', function(e) {
			if (e.key != 'enter' && e.key != 'up' && e.key != 'down' && e.key != 'esc' && e.key != 'tab') {
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
			if (e.key === 'esc' || e.key === 'tab') {
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
		
		this.select.setStyle('display', 'none');
		
		this.fireEvent('onBuild');
	},
	
	currentNext: function(add) {
		var i = this.current + add;
		while (i != this.current) {
			i = i > this.elements.optionCopy.length-1 ? 0 : i;
			i = i < 0 ? this.elements.optionCopy.length-1 : i;
			
			if (this.elements.optionCopy[i].getStyle('display') === 'block') {
				this.setCurrent(i);
				
				var position = this.elements.optionCopy[i].getPosition(this.optionWrap), scroll = this.optionWrap.getScroll()
				if (position.y < 0) {
					this.optionWrap.scrollTo(0, scroll.y + position.y);
				}
				
				var moveSize = this.optionWrap.getSize().y - this.elements.optionCopy[i].getSize().y;
				if (position.y >= moveSize) {
					this.optionWrap.scrollTo(0, scroll.y + (position.y - moveSize));
				}
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
		el.addClass('ui-current');
	},
	
	selectOption: function(mixed) {
		el = Type.isElement(mixed) ? mixed : this.elements.optionCopy[mixed];
	
		if (this.options.mode === 'single') {
			this.elements.optionCopy.invoke('removeClass', this.options.ui.activeClass);
			el.addClass(this.options.ui.activeClass);
			this.close();
		}
		if (this.options.mode === 'multiple') {
			el.toggleClass(this.options.ui.activeClass);
		}
		this.fireEvent('select');
	},
	
	synch: function(mode) {
		this.activeEls = this.elements.optionCopy.filter(function(el) { return el.hasClass(this.options.ui.activeClass); }.bind(this));
		var mode = mode || 'toSelect';
		if (mode === 'toSelect') {
			this.elements.option.invoke('set', 'selected', false);
			this.elements.optionCopy.each(function(el, i) {
				if (el.hasClass(this.options.ui.activeClass)) {
					this.elements.option[i].set('selected', true);
				}
			}, this);
		} else if (mode === 'fromSelect') {
			this.elements.option.each(function(el, i) {
				if (el.get('selected') === true) {
					this.elements.optionCopy[i].addClass(this.options.ui.activeClass);
				}
			}, this);
		}
	},
	
	filter: function(text) {
		var text = text || '';
		this.elements.optionCopy.invoke('setStyle', 'display', 'block');
		
		this.elements.optionCopy.each(function(el) {
			var elText = el.get('text');
			var foundIndex = elText.indexOf(text);
			if (foundIndex > -1) {
				if (text != '') {
					var marked = '<span class="' + this.options.ui.searchMarkClass + '">' + elText.substr(foundIndex, text.length) + '</span>';
					el.set('html', elText.substring(0, foundIndex) + marked + elText.substring(foundIndex + text.length, elText.length));
				} else {
					el.set('html', elText);
				}
			} else {
				el.setStyle('display', 'none');
			}
		}, this);
	},
	
	setStatus: function(text) {
		this.synch();
		var text = text || '';
		if (this.activeEls.length === 1 && text === '') {
			text = this.options.single.statusTemplate.substitute({element: this.activeEls[0].get('text'), count: this.activeEls.length});
		}
		if (this.activeEls.length > 1 && text === '') {
			elements = this.activeEls.invoke('get', 'text').join(', ').truncate(this.options.multiple.statusElementsTruncate.length, this.options.multiple.statusElementsTruncate.trail);
			text = this.options.multiple.statusTemplate.substitute({element: this.activeEls[0].get('text'), elements: elements, count: this.activeEls.length});
		}
		if (text !== '') {
			this.statusWrap.removeClass(this.options.ui.defaultStatusClass);
		} else {
			this.statusWrap.addClass(this.options.ui.defaultStatusClass);
			text = this.options.defaultStatus
		}
		this.statusWrap.set('value', text);
	},
	
	open: function() {
		this.optionWrap.setStyle('display', 'block');
		this.isOpen = true;
	},

	close: function() {
		this.setStatus();
		this.optionWrap.setStyle('display', 'none');
		this.isOpen = false;
		this.fireEvent('close');
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