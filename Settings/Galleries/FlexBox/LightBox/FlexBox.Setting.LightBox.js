/*
---

name: Setting.FlexBox.LightBox

description: mimics the "original" LightBox Theme

license: MIT-style license.

requires: [FlexBox]

provides: [Setting.FlexBox.LightBox]

...
*/

SettingsStore.FlexBox = SettingsStore.FlexBox || {};

SettingsStore.FlexBox.LightBox = {
	ui: { wrap: { 'class': 'flexBoxWrap lightBox' } },
	manualClose: true,
	flexSlide: {
		render: ['item', {'controls': ['previous', 'next']}, {'bottom': [{'description': ['counter']}, 'close']}],
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