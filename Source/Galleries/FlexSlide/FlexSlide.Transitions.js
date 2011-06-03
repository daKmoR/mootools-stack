/*
---

name: FlexSlide.Transitions

description: FlexSlide Transitions - gives you multiple Transition effects

license: MIT-style license.

requires: FlexSlide

provides: 

...
*/

FlexSlide.implement('options', {

	effect: {
		options: {
			slideLeftQuart: { transition: Fx.Transitions.Quart.easeInOut },
			slideRightQuart: { transition: Fx.Transitions.Quart.easeInOut },
			slideLeftBounce: { transition: Fx.Transitions.Bounce.easeOut },
			slideRightBounce: { transition: Fx.Transitions.Bounce.easeOut },
			slideTopQuart: { transition: Fx.Transitions.Quart.easeInOut },
			slideBottomQuart: { transition: Fx.Transitions.Quart.easeInOut },
			slideTopBounce: { transition: Fx.Transitions.Bounce.easeOut },
			slideBottomBounce: { transition: Fx.Transitions.Bounce.easeOut }
		}
	},
	effects: {
		slideLeft: function(current, next, currentEl, nextEl) {
			//var width = currentEl.getSize().x + currentEl.getStyle('margin-left').toInt() + currentEl.getStyle('margin-right').toInt();
			this.fxConfig[current] = { 'left': this.options.size.x*-1 };
			this.fxConfig[next]    = { 'left': 0 };
		},
		slideLeftPrepare: function(current, next, currentEl, nextEl) {
			// console.log('setting 0 for id' + current, currentEl);
			// console.log('setting size.x for id' + next, nextEl);
			// console.log('setting', this.options.size.x);
			currentEl.setStyle('left', 0);
			nextEl.setStyle('left', this.options.size.x);
		},
		slideRight: function(current, next, currentEl, nextEl) {
			var width = currentEl.getSize().x + currentEl.getStyle('margin-left').toInt() + currentEl.getStyle('margin-right').toInt();
			this.fxConfig[current] = { 'right': [0, width*-1] };
			this.fxConfig[next]    = { 'right': [width, 0] };
		},
		slideLeftQuart:   function(current, next, currentEl, nextEl) { this.options.effects.slideLeft.call (this, current, next, currentEl, nextEl); },
		slideLeftQuartPrepare:   function(current, next, currentEl, nextEl) { this.options.effects.slideLeftPrepare.call (this, current, next, currentEl, nextEl); },
		slideRightQuart:  function(current, next, currentEl, nextEl) { this.options.effects.slideRight.call(this, current, next, currentEl, nextEl); },
		slideLeftBounce:  function(current, next, currentEl, nextEl) { this.options.effects.slideLeft.call (this, current, next, currentEl, nextEl); },
		slideRightBounce: function(current, next, currentEl, nextEl) { this.options.effects.slideRight.call(this, current, next, currentEl, nextEl); },
		slideTop: function(current, next, currentEl, nextEl) {
			var height = currentEl.getSize().y + currentEl.getStyle('margin-top').toInt() + currentEl.getStyle('margin-bottom').toInt();
			this.fxConfig[current] = { 'top': [0, height*-1] };
			this.fxConfig[next]    = { 'top': [height, 0] };
		},
		slideBottom: function(current, next, currentEl, nextEl) {
			var height = currentEl.getSize().y + currentEl.getStyle('margin-top').toInt() + currentEl.getStyle('margin-bottom').toInt();
			this.fxConfig[current] = { 'bottom': [0, height*-1] };
			this.fxConfig[next]    = { 'bottom': [height, 0] };
		},
		slideTopQuart:  function(current, next, currentEl, nextEl) { this.options.effects.slideTop.call(this, current, next, currentEl, nextEl); },
		slideBottomQuart:  function(current, next, currentEl, nextEl) { this.options.effects.slideBottom.call(this, current, next, currentEl, nextEl); },
		slideTopBounce:  function(current, next, currentEl, nextEl) { this.options.effects.slideTop.call (this, current, next, currentEl, nextEl); },
		slideBottomBounce: function(current, next, currentEl, nextEl) { this.options.effects.slideBottom.call(this, current, next, currentEl, nextEl); }
	}

});