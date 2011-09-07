/*
---

name: Setting.FlexBox.MediaBox

description: mimics the "original" LightBox Theme with bottom controls to allow media elements

license: MIT-style license.

requires: [FlexBox]

provides: [Setting.FlexBox.MediaBox]

...
*/

SettingsStore.FlexBox = SettingsStore.FlexBox || {};

SettingsStore.FlexBox.MediaBox = {
	ui: { wrap: { 'class': 'flexBoxWrap mediaBox' } },
	manualClose: true,
	flexSlide: {
		render: ['item', {'bottom': [{'description': [{'controls': ['previous', 'counter', 'next']}]}, 'close']}],
		counterTemplate: 'Image {id} of {count}'
	},
	onOpen: function() {
		this.flexSlide.bottomWrap.fade('hide');
	},
	onOpenEnd: function() {
		if( $chk(this.flexSlide.bottomWrap) ) {
			this.flexSlide.bottomWrap.fade(1);
		}
	},
	onClose: function() {
		if( !this.flexSlide.running ) {
			this.flexSlide.bottomWrap.fade(0).get('tween').chain( function() {
				this._close();
			}.bind(this) );
		}
	},
	onCloseEnd: function() {
		if( $defined(this.flexSlide.elements.description) ) {
			this.flexSlide.elements.description.set('style', '');
		}
	}
}