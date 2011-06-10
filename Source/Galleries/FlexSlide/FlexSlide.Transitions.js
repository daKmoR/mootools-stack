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
		slideLeftInPrepare:  function(id, el) { el.setStyle('left', this.size.width); },
		slideLeftIn:         function(id, el) { this.fxConfig[id] = { 'left': 0 }; },
		slideLeftOutPrepare: function(id, el) { el.setStyle('left', 0); },
		slideLeftOut:        function(id, el) { this.fxConfig[id] = { 'left': this.size.width*-1 }; },
		
		slideRightInPrepare:  function(id, el) { el.setStyle('right', this.size.width); },
		slideRightIn:         function(id, el) { this.fxConfig[id] = { 'right': 0 }; },
		slideRightOutPrepare: function(id, el) { el.setStyle('right', 0); },
		slideRightOut:        function(id, el) { this.fxConfig[id] = { 'right': this.size.width*-1 }; },
		
		slideLeftQuartInPrepare:  function(id, el) { this.options.effects.slideLeftInPrepare.call(this, id, el); },
		slideLeftQuartIn:         function(id, el) { this.options.effects.slideLeftIn.call(this, id, el); },
		slideLeftQuartOutPrepare: function(id, el) { this.options.effects.slideLeftOutPrepare.call(this, id, el); },
		slideLeftQuartOut:        function(id, el) { this.options.effects.slideLeftOut.call(this, id, el); },
		
		slideRightQuartInPrepare:  function(id, el) { this.options.effects.slideRightInPrepare.call(this, id, el); },
		slideRightQuartIn:         function(id, el) { this.options.effects.slideRightIn.call(this, id, el); },
		slideRightQuartOutPrepare: function(id, el) { this.options.effects.slideRightOutPrepare.call(this, id, el); },
		slideRightQuartOut:        function(id, el) { this.options.effects.slideRightOut.call(this, id, el); },
		
		slideLeftBounceInPrepare:  function(id, el) { this.options.effects.slideLeftInPrepare.call(this, id, el); },
		slideLeftBounceIn:         function(id, el) { this.options.effects.slideLeftIn.call(this, id, el); },
		slideLeftBounceOutPrepare: function(id, el) { this.options.effects.slideLeftOutPrepare.call(this, id, el); },
		slideLeftBounceOut:        function(id, el) { this.options.effects.slideLeftOut.call(this, id, el); },
		
		slideRightBounceInPrepare:  function(id, el) { this.options.effects.slideRightInPrepare.call(this, id, el); },
		slideRightBounceIn:         function(id, el) { this.options.effects.slideRightIn.call(this, id, el); },
		slideRightBounceOutPrepare: function(id, el) { this.options.effects.slideRightOutPrepare.call(this, id, el); },
		slideRightBounceOut:        function(id, el) { this.options.effects.slideRightOut.call(this, id, el); },
		
		
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