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
		mode: 'single',
		show: 0
	},
	
	current: -1,
	elements: {},
	isOpen: false,
	status: '',
	
	initialize: function(select, options) {
		if (!(this.select = $(select))) return;
		if (this.select.get('multiple') === 'multiple') {
			this.options.mode = 'multiple';
		}
		this.setOptions(options);

		this.build();
		$$('.colmask')[0].setStyle('height', 1000);
	},
	
	build: function() {
		this.wrap = new Element('div', this.options.ui.wrap);
		this.wrap.setStyles({ width: this.select.getSize().x, height: this.select.getSize().y});
		this.wrap.inject(this.select, 'after');
		
		this.builder( this.options.render, this.wrap );
		
		this.statusWrap.addEvent('click', this.toggle.bind(this));
		
		this.statusWrap.addEvent('keyup', function(e) {
			console.log(e);
			this.statusWrap.set('html', e.key);
		}.bind(this));
		
		this.elements.optionCopy.each(function(el) {
			el.addEvent('click', function(e) {
				e.stop();
				this.selectOption(el);
			}.bind(this));
		}, this);
		
		
		this.fireEvent('onBuild');
	},
	
	selectOption: function(el) {
		if (this.options.mode === 'single') {
			this.elements.optionCopy.invoke('removeClass', this.options.ui.activeClass);
			this.close();
		}
		el.addClass(this.options.ui.activeClass);
		this.setStatus(el.get('text'));
		this.synch();
	},
	
	synch: function(mode) {
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
	
	setStatus: function(status) {
		this.statusWrap.set('html', status);
	},
	
	open: function() {
		this.optionsWrap.tween('height', this.optionWrap.getSize().y);
		this.isOpen = true;
	},

	close: function() {
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
		this[item + 'Wrap'] = new Element('div', this.options.ui[item]).inject( wrapper );
		
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