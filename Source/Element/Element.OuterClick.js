/*
---

name: Element.OuterClick

description: allows to add an click event to everything but the element itself - property by kassens http://blog.kassens.net/outerclick-event

license: MIT-style license.

requires: [Core/Element.Event]

provides: Element.OuterClick

...
*/ 

(function(){
	var events;
	var check = function(e){
		var target = $(e.target);
		var parents = target.getParents();
		events.each(function(item){
			var element = item.element;
			if (element != target && !parents.contains(element))
				item.fn.call(element, e);
		});
	};
	Element.Events.outerClick = {
		onAdd: function(fn){
			if(!events) {
				document.addEvent('click', check);
				events = [];
			}
			events.push({element: this, fn: fn});
		},
		onRemove: function(fn){
			events = events.filter(function(item){
				return item.element != this || item.fn != fn;
			}, this);
			if (!events.length) {
				document.removeEvent('click', check);
				events = null;
			}
		}
	};
}).call(this);