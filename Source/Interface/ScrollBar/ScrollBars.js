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
		vertical: {},
		horizontal: {},
		both: {
			vertical: {},
			horizontal: { wheel: false }
		}
	},
	
	scrollBars: [],
	
	initialize: function(elements, options) {
		var options = options || { sliderOptions: { mode: 'vertical' } };
		var _mode = options.sliderOptions.mode;
		$$(elements).each( function(el) {
			if (el.hasClass('scrollBarBoth')) {
				options.sliderOptions.mode = 'both';
			}
			if (el.hasClass('scrollBarVertical')) {
				options.sliderOptions.sliderOptions.mode = 'vertical';
			}
			if (el.hasClass('scrollBarHorizontal')) {
				options.sliderOptions.mode = 'horizontal';
			}
		
			if (options.sliderOptions.mode === 'both') {
				options.sliderOptions.mode = 'vertical';
				this.scrollBars.include( new ScrollBar(el, options) );
				options.sliderOptions.mode = 'horizontal';
			}
			this.scrollBars.include( new ScrollBar(el, options) );
			options.sliderOptions.mode = _mode;
		}, this);
	},
	
	getScrollBars: function() {
		return this.scrollBars;
	}
	
});