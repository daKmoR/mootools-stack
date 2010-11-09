/*
---

script: ScrollBars.js
 
name: ScrollBars

description: A simple ScrollBar

license: MIT-style license

authors:
  - Thomas Allmer

requires: [ScrollBar]

provides: ScrollBars
 
...
*/

var ScrollBars = new Class({
	
  Implements: Settings,
	
	options: {
		mode: 'auto',
		auto: { sliderOptions: { mode: 'vertical' } },
		vertical: { sliderOptions: { mode: 'vertical' } },
		horizontal: { sliderOptions: { mode: 'horizontal' } },
		both: {
			vertical: { sliderOptions: { mode: 'vertical' } },
			horizontal: { sliderOptions: { mode: 'horizontal' }, wheel: false, x: -10 }
		}
	},
	
	scrollBars: [],
	
	initialize: function(elements, _options) {
		this.setOptions(_options);
		$$(elements).each( function(el) {
			
			if (this.options.mode === 'auto' && el.hasClass('scrollBarBoth')) {
				this.options.mode = 'both';
			}
			if (this.options.mode === 'auto' && el.hasClass('scrollBarVertical')) {
				this.options.mode = 'vertical';
			}
			if (this.options.mode === 'auto' && el.hasClass('scrollBarHorizontal')) {
				this.options.mode = 'horizontal';
			}
			
			options = Object.clone(this.options[this.options.mode]);
		
			if (this.options.mode === 'both') {
				options = this.options.both.horizontal;
				this.scrollBars.include( new ScrollBar(el, options) );
				options = this.options.both.vertical;
			}
			
			this.scrollBars.include( new ScrollBar(el, options) );
		}, this);
	},
	
	getScrollBars: function() {
		return this.scrollBars;
	}
	
});