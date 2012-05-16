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

	Implements: [Options, Events],

	options: {
		auto: true,
		duration: 5000
	},

	autotimer: null,
	doAuto: false,

	initialize: function(options) {
		this.setOptions(options);
		this.doAuto = !!this.options.auto;
	},

	auto: function() {
		clearTimeout(this.autotimer);
		this.autotimer = this.next.delay(this.options.duration, this);
	},

	/* you have to define your own
	next: function() {}
	 */

	show: function() {
		if (this.doAuto === true) {
			this.auto();
		}
	},

	toggle: function() {
		if (this.doAuto === true) {
			this.stop();
		} else {
			this.start();
		}
	},

	stop: function() {
		this.doAuto = false;
		clearTimeout(this.autotimer);
	},

	start: function() {
		this.doAuto = true;
		this.auto();
	}

});