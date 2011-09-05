/*
---
name: Behavior.FlexBox
description: Adds a slide interface (FlexBox instance)
provides: [Behavior.FlexBox]
requires: [Behavior/Behavior, /FlexBox]
script: Behavior.FlexBox.js

...
*/

Behavior.addGlobalFilters({

	FlexBox: function(element, api) {
		
		globalFlexBox = document.id(document.body).retrieve('Behavior::FlexBox', new FlexBox(null, {
				ui: { wrap: { 'class': 'flexBoxWrap mediaBox' } },
				manualClose: true,
				flexSlide: {
					render: ['item', {'bottom': [{'description': [{'controls': ['previous', 'counter', 'next']}]}, 'close']}],
					counterTemplate: 'Media {id} of {count}'
				},
				onOpen: function() {
					this.flexSlide.bottomWrap.fade('hide');
				},
				onOpenEnd: function() {
					if (this.flexSlide.bottomWrap != undefined) {
						this.flexSlide.bottomWrap.fade(1);
					}
				},
				onClose: function() {
					if (!this.flexSlide.running) {
						this.flexSlide.bottomWrap.fade(0).get('tween').chain(function() {
							this._close();
						}.bind(this));
					}
				},
				onCloseEnd: function() {
					if (this.flexSlide.elements.description != undefined) {
						this.flexSlide.elements.description.set('style', '');
					}
				}
				
			})
		);
		
		globalFlexBox.attach(element);
		
		return globalFlexBox;
		
	}

});