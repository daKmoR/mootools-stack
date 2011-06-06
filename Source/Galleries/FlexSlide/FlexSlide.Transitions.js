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
			this.fxConfig[current] = { 'left': this.options.size.x*-1 };
			this.fxConfig[next]    = { 'left': 0 };
		},
		slideLeftPrepare: function(current, next, currentEl, nextEl) {
			currentEl.setStyle('left', 0);
			nextEl.setStyle('left', this.options.size.x);
		},
		slideRight: function(current, next, currentEl, nextEl) {
			this.fxConfig[current] = { 'right': this.options.size.x*-1 };
			this.fxConfig[next]    = { 'right': 0 };
		},
		slideRightPrepare: function(current, next, currentEl, nextEl) {
			currentEl.setStyle('right', 0);
			nextEl.setStyle('right', this.options.size.x);
		},
		slideLeftQuart:         function(current, next, currentEl, nextEl) { this.options.effects.slideLeft.call(this, current, next, currentEl, nextEl); },
		slideLeftQuartPrepare:  function(current, next, currentEl, nextEl) { this.options.effects.slideLeftPrepare.call(this, current, next, currentEl, nextEl); },
		slideRightQuart:        function(current, next, currentEl, nextEl) { this.options.effects.slideRight.call(this, current, next, currentEl, nextEl); },
		slideRightQuartPrepare: function(current, next, currentEl, nextEl) { this.options.effects.slideRightPrepare.call(this, current, next, currentEl, nextEl); },
		slideLeftBounce:  function(current, next, currentEl, nextEl) { this.options.effects.slideLeft.call (this, current, next, currentEl, nextEl); },
		slideLeftBouncePrepare:  function(current, next, currentEl, nextEl) { this.options.effects.slideLeftPrepare.call(this, current, next, currentEl, nextEl); },
		slideRightBounce: function(current, next, currentEl, nextEl) { this.options.effects.slideRight.call(this, current, next, currentEl, nextEl); },
		slideRightBouncePrepare:  function(current, next, currentEl, nextEl) { this.options.effects.slideRightPrepare.call(this, current, next, currentEl, nextEl); },
		slideTop: function(current, next, currentEl, nextEl) {
			this.fxConfig[current] = { 'top': this.options.size.y*-1 };
			this.fxConfig[next]    = { 'top': 0 };
		},
		slideTopPrepare: function(current, next, currentEl, nextEl) {
			currentEl.setStyle('top', 0);
			nextEl.setStyle('top', this.options.size.x);
		},
		slideBottom: function(current, next, currentEl, nextEl) {
			this.fxConfig[current] = { 'bottom': this.options.size.y*-1 };
			this.fxConfig[next]    = { 'bottom': 0 };
		},
		slideBottomPrepare: function(current, next, currentEl, nextEl) {
			currentEl.setStyle('bottom', 0);
			nextEl.setStyle('bottom', this.options.size.x);
		},
		slideTopQuart:  function(current, next, currentEl, nextEl) { this.options.effects.slideTop.call(this, current, next, currentEl, nextEl); },
		slideTopQuartPrepare:  function(current, next, currentEl, nextEl) { this.options.effects.slideTopPrepare.call(this, current, next, currentEl, nextEl); },
		slideBottomQuart:  function(current, next, currentEl, nextEl) { this.options.effects.slideBottom.call(this, current, next, currentEl, nextEl); },
		slideBottomQuartPrepare:  function(current, next, currentEl, nextEl) { this.options.effects.slideBottomPrepare.call(this, current, next, currentEl, nextEl); },
		slideTopBounce:  function(current, next, currentEl, nextEl) { this.options.effects.slideTop.call (this, current, next, currentEl, nextEl); },
		slideTopBouncePrepare:  function(current, next, currentEl, nextEl) { this.options.effects.slideTopPrepare.call(this, current, next, currentEl, nextEl); },
		slideBottomBounce: function(current, next, currentEl, nextEl) { this.options.effects.slideBottom.call(this, current, next, currentEl, nextEl); },
		slideBottomBouncePrepare:  function(current, next, currentEl, nextEl) { this.options.effects.slideBottomPrepare.call(this, current, next, currentEl, nextEl); }
	}

});