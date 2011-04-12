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

	},
	
	checkboxes: [],
	spans: [],
	mode: false,
	first: false,
	
	initialize: function(elements, options) {
		//this.elements = $$(elements);
		this.checkboxes = $$('input[type="checkbox"]');
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
						if (that.mode == 'enable') { this.addClass('checked');	}
						if (that.mode == 'disable') {	this.removeClass('checked'); }
						
						if (that.first === true) {
							that.synch();
						}
					},
					'mouseenter': function() {
						if (that.mode == 'enable') { this.addClass('checked');	}
						if (that.mode == 'disable') {	this.removeClass('checked'); }
					},
					'mouseleave': function() {
						this.removeClass('pushed');
						if (that.first && that.mode == 'enable') { this.addClass('checked');	}
						if (that.first && that.mode == 'disable') {	this.removeClass('checked'); }
						that.first = false;
					}
				});
				checkbox.addEvent('change', function() { 
					if (this.mode === false) {
						this.synch('fromCheckboxes');
					}
				}.bind(this));
			}
		
		}, this);
		
		window.addEvent('mouseup', function() {
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