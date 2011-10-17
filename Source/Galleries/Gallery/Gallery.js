/*
---

name: Gallery

description: Gallery base class use with Implements

license: MIT-style license.

requires: Class

provides: [Gallery]

...
*/

var Gallery = new Class({

	options: {
		auto: true,
		duration: 5000,
		mode: 'repeat', /* [repeat, reverse, random, once] */
		step: 1,
		times: 1,
		ui: {
			activeClass: 'ui-Active',
			stopClass: 'ui-Stop'
		},
		effect: {
			up: 'random', /* any availabele effect */
			down: 'random' /* any availabele effect */
		}
	},

	auto: function() {
		clearTimeout(this.autotimer);
		this.autotimer = this.next.delay(this.options.duration, this);
	},
	
	getNextId: function(times, current) {
		var times = times || this.options.times, next = 0;
		var current = current || this.current;
		step = this.options.step*times;
		
		if (this.options.mode === 'reverse') {
			step *= -1;
		}
			
		if (this.options.mode === 'random') {
			do {
				next = Number.random(0, this.elements.item.length-1);
			} while (next == current)
		} else {
			if (current + step < this.elements.item.length) {
				next = current + step;
			} else {
				next = current + step - this.elements.item.length;
			}
			if (current + step < 0) {
				next = this.elements.item.length + current + step;
			}
		}
		
		if (this.elements.item[next]) {
			return next;
		}
		
		return -1;
	},
	
	next: function(times, fx) {
		var times = times || this.options.times;
		var fx = fx || this.options.effect.up;
		next = this.getNextId(times);
		this.show(next, fx);
	},
	
	previous: function(times) {
		var times = times || this.options.times;
		this.next(times * -1, this.options.effect.down);
	},
	
	process: function(id) {
		this.current = id;
		if(this.options.auto) this.auto();
	},
	
	toggle: function() {
		if (this.options.auto) {
			this.stop();
		} else {
			this.start();
		}
	},
	
	stop: function() {
		this.options.auto = false;
		clearTimeout(this.autotimer);
		if (this.toggleWrap) {
			this.toggleWrap.addClass(this.options.ui.stopClass);
		}
		if (this.stopWrap) {
			this.stopWrap.addClass(this.options.ui.activeClass);
		}
		if (this.startWrap) {
			this.startWrap.removeClass(this.options.ui.activeClass);
		}
	},
	
	start: function() {
		this.options.auto = true;
		this.auto();
		if (this.toggleWrap) {
			this.toggleWrap.removeClass(this.options.ui.stopClass);
		}
		if (this.stopWrap) {
			this.stopWrap.removeClass(this.options.ui.activeClass);
		}
		if (this.startWrap) {
			this.startWrap.addClass(this.options.ui.activeClass);
		}
	}

});