/*
---

name: Checkboxes

description:  create multiple Selects

license: MIT-style license.

requires: [Core/Browser, Core/Element.Dimensions, Core/Element.Style, Class.Settings]

provides: Checkboxes

...
*/

var Checkboxes = new Class({

	Implements: [Settings, Events],
	options: {
		mode: 'auto' // 'auto': determine on first click; false: disable moveselection; 'disable': only disable; 'enable': only enable; 
	},
	
	checkboxes: [],
	spans: [],
	mode: false,
	first: false,
	
	initialize: function(checkboxes, options) {
		this.checkboxes = $$(checkboxes);
		this.setOptions(options);
		
		this.build();
		this.synch('fromCheckboxes');
	},
	
	build: function() {
		this.checkboxes.each(function(checkbox, i) {
		
			this.spans[i] = new Element('span', {'class': 'checkbox' });
			this.spans[i].inject(checkbox, 'before');
			checkbox.setStyle('display', 'none');
			
			if (checkbox.get('disabled') === false) {
				var that = this;
				this.spans[i].addEvents({
					'mousedown': function(e) { 
						e.stop();
						that.mode = this.hasClass('checked') ? 'disable' : 'enable';
						that.first = true;
						this.addClass('pushed');
					},
					'mouseup': function() {
						this.removeClass('pushed');
						
						if ((!that.options.mode === 'enable' && !that.options.mode === 'disable') || that.first === true) {
							if (that.mode === 'enable') { this.addClass('checked');	}
							if (that.mode === 'disable') { this.removeClass('checked'); }
						}
						
						if (that.first === true) {
							that.synch();
						}
					},
					'mouseleave': function(e) {
						e.stop();
						if (that.options.mode !== false) {
							if (that.first && that.mode == 'enable') { this.addClass('checked');	}
							if (that.first && that.mode == 'disable') {	this.removeClass('checked'); }
						}
						that.first = false;
						this.removeClass('pushed');
					}
				});
				
				if (that.options.mode !== false) {
					this.spans[i].addEvent('mouseenter', function(e) {
						e.stop();
						var localMode = that.mode && (that.options.mode === 'enable' || that.options.mode === 'disable') ? that.options.mode : that.mode;
						if (localMode == 'enable') { this.addClass('checked');	}
						if (localMode == 'disable') {	this.removeClass('checked'); }
					});
				}
				
				checkbox.addEvent('change', function() {
					if (this.mode === false) {
						this.synch('fromCheckboxes');
					}
				}.bind(this));
			}
		
		}, this);
		
		document.addEvent('mouseup', function() {
			if (this.mode == 'enable' || this.mode == 'disable') {
				if (this.first === false) {
					this.synch();
				}
				this.mode = false;
			}
		}.bind(this));
	},
	
	synch: function(mode) {
		var mode = mode || 'toCheckboxes';
		if (mode === 'toCheckboxes') {
			this.spans.each(function(el, i) {
				if (el.hasClass('checked') && this.checkboxes[i].get('checked') === false) {
					this.checkboxes[i].set('checked', true);
					this.checkboxes[i].fireEvent('change');
				}
				if (!el.hasClass('checked') && this.checkboxes[i].get('checked') === true) {
					this.checkboxes[i].set('checked', false);
					this.checkboxes[i].fireEvent('change');
				}
				if (el.hasClass('disabled') && this.checkboxes[i].get('disabled') === false) {
					this.checkboxes[i].set('disabled', true);
				}
			}, this);
		} else if (mode === 'fromCheckboxes') {
			this.checkboxes.each(function(el, i) {
				if (el.get('disabled') === false) {
					if (el.get('checked') === true) {
						this.spans[i].addClass('checked');
					} else {
						this.spans[i].removeClass('checked');
					}
				} else {
					this.spans[i].addClass('disabled');
				}
			}, this);
		}
	}
	
});