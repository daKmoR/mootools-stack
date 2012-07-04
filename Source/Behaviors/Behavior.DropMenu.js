/*
---
name: Behavior.DropMenu
description: Adds a DropMenu interface to the input.
provides: [Behavior.DropMenu]
requires: [Behavior/Behavior, MooDropMenu/MooDropMenu, Core/Fx.Tween, Behavior/Element.Data, More/Object.Extras]
script: Behavior.DropMenu.js

...
*/

Behavior.addGlobalFilter('DropMenu', {

	setup: function(element, api) {
		return new MooDropMenu(element, {
			onOpen: function(el){
				el.fade('in');
			},
			onClose: function(el){
				el.fade('out');
			},
			onInitialize: function(el){
				el.setStyle('display', 'block').fade('hide');
			}
		});
	}

});