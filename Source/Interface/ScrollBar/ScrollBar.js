/*
---

script: ScrollBar.js
 
name: ScrollBar

description: A simple ScrollBar

license: MIT-style license

authors:
  - Thomas Allmer

requires: [Core/Class, Core/Element.Event, Core/Element.Dimensions, Core/Fx.Tween, Core/Fx.Transitions, Core/Selectors, More/Fx.Scroll, More/Slider, Class.Settings]

provides: ScrollBar
 
...
*/

var ScrollBar = new Class({
	
  Implements: Settings,

	options: {
		stopDraggingOnLeave: true,
		wheel: true,
		wheelMultiplier: 30,
		
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
			this.options.sliderOptions.steps = this.el.getScrollSize().y - this.el.getSize().y;
		} else {
			this.options.sliderOptions.steps = this.el.getScrollSize().x - this.el.getSize().x;
		}
		
		// bind onChange (?)
		this.options.sliderOptions.onChange = this.options.sliderOptions.onChange.bind(this);
		
		this.slider = new Slider(this.Bar, this.Handle, this.options.sliderOptions).set(0);
		
		if (this.options.wheel) {
			this.wrap.addEvent('mousewheel', function(e) {
				e.stop();
				this.slider.set( this.slider.step - e.wheel * this.options.wheelMultiplier );
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
		if (!this.el.getParent().hasClass('scrollBarWrap')) {
			this.wrap = new Element('div[class="scrollBarWrap"]');
			this.wrap.wraps( this.el );
		} else {
			this.wrap = this.el.getParent();
		}
		
		this.Bar = new Element('div', {	'class': 'scrollBar' + this.options.sliderOptions.mode.capitalize() + 'Bar' });
		this.Handle = new Element('div', {	'class': 'scrollBar' + this.options.sliderOptions.mode.capitalize() + 'Handle' });
		
		this.wrap.grab( this.Bar.grab(this.Handle) );
		
		if (this.options.sliderOptions.mode === 'vertical') {
			this.wrap.grab( new Element('div[class="clear"]') );

			this.el.setStyle('width', this.el.getSize().x - this.Bar.getSize().x);
			this.Bar.setStyle('height', this.el.getSize().y);
		}
		
		if (this.options.sliderOptions.mode === 'horizontal') {
			this.Bar.setStyle('width', this.el.getSize().x);
		}
	}

});