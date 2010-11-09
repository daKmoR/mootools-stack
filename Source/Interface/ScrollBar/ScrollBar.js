/*
---

script: ScrollBar.js
 
name: ScrollBar

description: A simple ScrollBar

license: MIT-style license

authors:
  - Thomas Allmer

requires: [Core/Class, Core/Element.Event, Core/Element.Dimensions, Core/Selectors, More/Slider, Class.Settings]

provides: ScrollBar
 
...
*/

var ScrollBar = new Class({
	
  Implements: Settings,

	options: {
		stopDraggingOnLeave: true,
		wheel: true,
		stepMultiplier: 30,
		x: 0,
		y: 0,
		
		sliderOptions: {
			mode: 'vertical',
			wheel: false,
			onChange: function(step) {
				var x = 0, y = 0;
				if (this.slider) {
					x = (this.slider.options.mode === 'vertical') ? 0 : step;
					y = (this.slider.options.mode === 'vertical') ? step : 0;
				}
				this.el.scrollTo(x, y);
			}
		}
		
	},
	
	initialize: function(el, options){
		this.el = $(el);
    this.setOptions(options);
		
		this.build();
		
		if ( this.options.sliderOptions.mode === 'vertical' ) {
			this.options.sliderOptions.steps = this.el.getScrollSize().y - this.el.getSize().y + this.options.y;
		} else {
			this.options.sliderOptions.steps = this.el.getScrollSize().x - this.el.getSize().x + this.options.x;
		}
		
		// bind onChange (?)
		this.options.sliderOptions.onChange = this.options.sliderOptions.onChange.bind(this);
		
		this.slider = new Slider(this.Bar, this.Handle, this.options.sliderOptions).set(0);
		
		if (this.options.wheel) {
			this.wrap.addEvent('mousewheel', function(e) {
				e.stop();
				this.slider.set( this.slider.step - e.wheel * this.options.stepMultiplier );
			}.bind(this));
		}
		
		// stop dragging if mouse leaves document body
		if (this.options.stopDraggingOnLeave) {
			$(document.body).addEvent('mouseleave', function() {
				this.slider.drag.stop();
			}.bind(this));
		}
	},
	
	build: function() {
		if (!this.el.getParent().hasClass('ui-scrollBarWrap')) {
			this.wrap = new Element('div[class="ui-scrollBarWrap"]');
			this.wrap.wraps( this.el );
		} else {
			this.wrap = this.el.getParent();
		}
		
		this.Bar = new Element('div', {	'class': 'ui-scrollBar' + this.options.sliderOptions.mode.capitalize() + 'Bar' });
		this.Handle = new Element('div', {	'class': 'ui-scrollBar' + this.options.sliderOptions.mode.capitalize() + 'Handle' });
		this.Bar.grab(this.Handle);
		
		this.el.addClass('ui-scrollBar' + this.options.sliderOptions.mode.capitalize());
		this.Bar.inject(this.el, 'after');
		
		if (this.options.sliderOptions.mode === 'vertical') {
			new Element('div[style="clear: both;"]').inject(this.Bar, 'after');
			
			this.el.setStyle('width', this.el.getSize().x - this.Bar.getSize().x + this.options.x);
			this.Bar.setStyle('height', this.el.getSize().y + this.options.y);
		}
		
		if (this.options.sliderOptions.mode === 'horizontal') {
			this.Bar.setStyle('width', this.el.getSize().x + this.options.x);
		}
		
		
	}

});