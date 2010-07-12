/*
---

name: Setting.FlexBox.LightBox

description: mimics the "original" LightBox Theme

license: MIT-style license.

requires: [FlexBox]

provides: [Setting.FlexBox.LightBox]

...
*/

SettingsStore.FlexBox.LightBox = {
	ui: { wrap: { 'class': 'flexBoxWrap lightBox' } },
	flexSlide: {
		render: [{'item': ['previous', 'next']}, { 'bottom': [{'description': ['counter']}, 'close'] } ],
		counterTemplate: 'Image {id} of {count}',
	}
}