/*
---

name: Fx.Value

description: 

license: MIT-style license.

requires: [Core/Fx]

provides: Fx.Value

...
*/ 

Fx.Value = new Class({
	Extends: Fx,
	compute: function(from, to, delta){
		this.value = Fx.compute(from, to, delta);
		this.fireEvent('motion', this.value);
		return this.value;
	},
	get: function(){
		return this.value || 0;
	}
});