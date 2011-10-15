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
					render: ['previous', 'item', 'next', {'bottom': [{'description': [{'controls': ['counter']}]}, 'close']}],
					counterTemplate: 'Media {id} of {count}'
				},
				onOpen: function() {
					this.flexSlide.bottomWrap.fade('hide');
					this.flexSlide.nextWrap.fade('hide');
					this.flexSlide.previousWrap.fade('hide');
				},
				onOpenEnd: function() {
					if (this.flexSlide.bottomWrap != undefined) {
						this.flexSlide.bottomWrap.fade(1);
					}
					if (this.flexSlide.nextWrap != undefined) {
						this.flexSlide.nextWrap.fade(1);
					}
					if (this.flexSlide.previousWrap != undefined) {
						this.flexSlide.previousWrap.fade(1);
					}
					
				},
				onClose: function() {
					if (!this.flexSlide.running) {
						this.flexSlide.nextWrap.fade(0);
						this.flexSlide.previousWrap.fade(0);
						this.flexSlide.bottomWrap.tween('opacity', 0).get('tween').chain(function() {
							this._close();
						}.bind(this));
					}
				},
				onCloseEnd: function() {
					if (this.flexSlide.elements.description != undefined) {
						this.flexSlide.elements.description.set('style', '');
					}
				},
				onLoaded: function(div) {
					api.applyFilters(div);
				}
			})
		);
		
		globalFlexBox.attach(element);
		
		return globalFlexBox;
		
	}

});