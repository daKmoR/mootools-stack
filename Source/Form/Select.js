/*
---

name: Select

description: asdf

license: MIT-style license.

requires: [Core/Browser, Core/Element.Dimensions, Core/Element.Style, More/String.Extras, More/Element.Forms, Class.Settings, Element.OuterClick]

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
			selectedClass: 'ui-Selected',
			searchMarkClass: 'ui-SearchMark',
			defaultStatusClass: 'ui-DefaultStatus',
			currentClass: 'ui-Current'
		},
		single: {	statusTemplate: '{element}', statusElementsTruncate: { length: 22, trail: '...' }	},
		multiple: {	statusTemplate: '({count}) {elements}', statusElementsTruncate: { length: 22, trail: '...' }, resetToZeroSelected: true },
		mode: 'single',
		defaultStatus: '',
		caseSensitive: false,
		noZeroSearchInputs: true
	},
	
	current: -1,
	elements: {},
	isOpen: false,
	shownElements: [],
	
	initialize: function(select, options) {
		if (!(this.select = $(select))) return;
		this.options.mode = (this.select.get('multiple') === true) ? 'multiple' : this.options.mode;
		this.options.defaultStatus = this.select.get('title') || this.options.defaultStatus;
		this.setOptions(options);
		
		this.form = this.options.form || this.select.getParent('form');
		if (!this.form) return;
		
		this.build();
		this.synch('fromSelect');
		
		this.form.addEvent('reset', function(e) {
			// wait to bubble up (so the browser function can reset all form elements) and then sync
			(function() {
				if (this.options.mode === 'multiple' && this.options.multiple.resetToZeroSelected) {
					this.elements.option.invoke('set', 'selected', false);
				}
				this.synch('fromSelect');
				this.setStatus();
			}).delay(10, this);
		}.bind(this));
		
		this.wrap.addEvent('outerClick', function() {
			this.close();
		}.bind(this));
		
		this.setStatus();
	},
	
	build: function() {
		this.wrap = new Element('div', this.options.ui.wrap);
		this.wrap.inject(this.select, 'after');
		
		this.builder( this.options.render, this.wrap );
		
		this.statusWrap.addEvent('focus', function() {
			this.statusWrap.selectRange(0, this.statusWrap.get('value').length);
			this.statusWrap.removeClass(this.options.ui.defaultStatusClass);
			this.filter();
			this.toggle();
		}.bind(this));
		
		this.statusWrap.addEvent('keyup', function(e) {
			if (e.key != 'enter' && e.key != 'up' && e.key != 'down' && e.key != 'esc' && e.key != 'tab') {
				this.filter(this.statusWrap.get('value'));
				if (this.options.noZeroSearchInputs) {
					while (this.shownElements.length === 0) {
						this.statusWrap.set('value', this.statusWrap.get('value').substring(0, this.statusWrap.get('value').length - 1));
						this.filter(this.statusWrap.get('value'));
					}
				}
				if (this.shownElements.length > 0) {
					this.setCurrent(this.shownElements[0]);
				}
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
				this.close();
			}
		}.bind(this));
		
		this.elements.optionCopy.each(function(el) {
			el.addEvent('click', function(e) {
				e.stop();
				this.selectOption(el);
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
		this.elements.optionCopy.invoke('removeClass', this.options.ui.currentClass);
		el.addClass(this.options.ui.currentClass);
	},
	
	selectOption: function(mixed) {
		el = Type.isElement(mixed) ? mixed : this.elements.optionCopy[mixed];
	
		if (this.options.mode === 'single') {
			this.elements.optionCopy.invoke('removeClass', this.options.ui.selectedClass);
			el.addClass(this.options.ui.selectedClass);
			this.close();
		}
		if (this.options.mode === 'multiple') {
			el.toggleClass(this.options.ui.selectedClass);
		}
		this.fireEvent('select');
	},
	
	synch: function(mode) {
		var mode = mode || 'toSelect';
		if (mode === 'toSelect') {
			this.elements.option.invoke('set', 'selected', false);
			this.elements.optionCopy.each(function(el, i) {
				if (el.hasClass(this.options.ui.selectedClass)) {
					this.elements.option[i].set('selected', true);
				}
			}, this);
		} else if (mode === 'fromSelect') {
			this.elements.option.each(function(el, i) {
				if (el.get('selected') === true) {
					this.elements.optionCopy[i].addClass(this.options.ui.selectedClass);
				} else {
					this.elements.optionCopy[i].removeClass(this.options.ui.selectedClass);
				}
			}, this);
		}
		this.selectedEls = this.elements.optionCopy.filter(function(el) { return el.hasClass(this.options.ui.selectedClass); }.bind(this));
	},
	
	filter: function(text) {
		var text = text || '';
		text = this.options.caseSensitive ? text : text.toLowerCase();
		this.elements.optionCopy.invoke('setStyle', 'display', 'block');
		this.shownElements = [];
		
		this.elements.optionCopy.each(function(el) {
			var elSearchText = this.options.caseSensitive ? el.get('text') : el.get('text').toLowerCase();
			var elText = el.get('text');
			var foundIndex = elSearchText.indexOf(text);
			if (foundIndex > -1) {
				if (text != '') {
					var marked = '<span class="' + this.options.ui.searchMarkClass + '">' + elText.substr(foundIndex, text.length) + '</span>';
					el.set('html', elText.substring(0, foundIndex) + marked + elText.substr(foundIndex + text.length));
				} else {
					el.set('html', elText);
				}
				this.shownElements.push(el);
			} else {
				el.setStyle('display', 'none');
			}
		}, this);
	},
	
	setStatus: function(text) {
		var text = text || '';
		if (this.selectedEls.length === 1 && text === '') {
			truncatedText = this.selectedEls[0].get('text').truncate(this.options.single.statusElementsTruncate.length, this.options.single.statusElementsTruncate.trail);
			text = this.options.single.statusTemplate.substitute({element: truncatedText, count: this.selectedEls.length});
		}
		if (this.selectedEls.length > 1 && text === '') {
			elements = this.selectedEls.invoke('get', 'text').join(', ').truncate(this.options.multiple.statusElementsTruncate.length, this.options.multiple.statusElementsTruncate.trail);
			text = this.options.multiple.statusTemplate.substitute({element: this.selectedEls[0].get('text'), elements: elements, count: this.selectedEls.length});
		}
		if (text !== '') {
			this.statusWrap.removeClass(this.options.ui.defaultStatusClass);
		} else {
			this.statusWrap.addClass(this.options.ui.defaultStatusClass);
			text = this.options.defaultStatus;
		}
		this.statusWrap.set('value', text);
	},
	
	open: function() {
		this.optionWrap.setStyle('display', 'block');
		this.isOpen = true;
		if (Browser.ie) {
			this.optionWrap.setStyle('height', 'auto');
			if (this.optionWrap.getSize().y >= this.optionWrap.getStyle('max-height').toInt()) {
				this.optionWrap.setStyle('height', this.optionWrap.getStyle('max-height').toInt());
			}
		}
	},

	close: function() {
		this.synch();
		this.setStatus();
		this.statusWrap.blur();
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