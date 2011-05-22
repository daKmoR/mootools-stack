/*
---

name: MooPath

description: To use MooPath you need to subclass it and add the method 'set' which will Copyright 2008 Sjors van der Pluijm http://www.desjors.nl/blog 

license: MIT-style license.

requires: [Core/Element.Dimensions, Core/Fx.Tween, Core/Fx.Transitions, Fx.Any, Gallery]

provides: MooPath

...
*/

var MooPath = new Class({

	Implements: [Options, Gallery],

	maxposition: 1,

	options: {
		show: 0,
		fxoptions: {},
		position: 'position',
		origsize: 'origsize',
		mode: 'reverse' /* [continuous, reverse, random] */
	},
	
	elements: {},

	initialize: function(elements, options) {
		if( !(this.elements.item = $$(elements)) ) return;
		this.setOptions(options);
		
		if( $type(this.options.show) === 'string' && this.options.show === 'random' ) {
			this.options.show = $random(0, this.elements.item.length-1);
		}
 		this.current = this.options.show;
		
		this.fx = new Fx.Any(this.elements.item, {pathpoint: this.set.bind(this)}, this.options.fxoptions);

		
		var numelements = this.elements.item.length;
 		this.elements.item.each(function(el, i) {
			var img = el.getElement('img');
			var size = img ? img.getSize() : el.getSize();
 			el.store(this.options.origsize,  size);
			el.setStyle('position', 'absolute');

			// Position element on path
			if (!el.retrieve(this.options.position)) {
				el.store(this.options.position, (i - this.current) / numelements);
			}
			this.set(el, el.retrieve(this.options.position));

			el.addEvent('click', function(e) {
				if( i !== this.current ) {
					e.stop();
					this.show(i);
					el.blur();
				}
			}.bind(this) );
 		}, this);
		
		this.show(this.options.show);
	},
	
	/*
	Property: turn
		Do a full animation from position 0 to position 1
		
	Arguments:
		numrounds - integer, number of rounds

	Example:
		(start code)
		new MooPath.Ellipse($$('a')).turn(2);
		(end)
	*/
	turn: function(numrounds) {
		var diff = numrounds * this.maxposition * -1;
		var obj = {};
		this.elements.item.each(function(el, i) {
			var curpos = el.retrieve(this.options.position);
			obj[i] = {pathpoint: [curpos, curpos - diff]};
			el.store(this.options.position, curpos - diff);
		}, this);
		this.fx.start(obj);
	},

	/*
	Property: show
		Brings the element to position 0 (front).
		
	Arguments:
		id - integer, the index of the item to show, or the actual element to show.

	Example:
		(start code)
		new MooPath.Ellipse($$('a')).show(1);
		(end)
	*/
	show: function(id) {
		if ($type(id) == 'element') {
		 	this.current = id = this.elements.item.indexOf(id);
		}
		this.current = id;
		
		var diff = this.movement(this.elements.item[id]);
		if (diff != 0) {
			var obj = {};
			this.elements.item.each(function(el, i) {
				var curpos = el.retrieve(this.options.position);
				obj[i] = {pathpoint: [curpos, curpos - diff]};
				el.store(this.options.position, curpos - diff);
			}, this);

			this.fx.start(obj);
		}
		
		this.process(id);
	},

	movement: function(el) {
		// Calculate movement diff (current position + diff = new position)
		return el.retrieve(this.options.position);
	}
});