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
		effect: {
			up: 'random', /* any availabele effect */
			down: 'random' /* any availabele effect */
		}
	},

	auto: function() {
		$clear(this.autotimer);
		this.autotimer = this.next.delay(this.options.duration, this);
	},
	
	getNextId: function(times, current) {
		var times = times || this.options.times, next = 0;
		var current = current || this.current;
		step = this.options.step*times;
		
		if ( this.options.mode === 'reverse' ) step *= -1;
			
		if ( this.options.mode === 'random' ) {
			do 
				next = $random(0, this.elements.item.length-1);
			while ( next == current )
		} else {
			if ( current + step < this.elements.item.length ) 
				next = current + step;
			else
				next = current + step - this.elements.item.length;
			if ( current + step < 0 ) 
				next = this.elements.item.length + current + step;
		}
		
		if( this.elements.item[next] )
			return next;
		
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
		if( this.options.auto ) this.auto();
	},
	
	stop: function() {
		$clear(this.autotimer);
	},
	
	start: function() {
		this.auto();
	}

});