/*
---

name: Setting.FlexSlide.Simple

description: a simple style for FlexSlide

license: MIT-style license.

requires: [FlexSlide]

provides: [Setting.FlexSlide.LightBox]

...
*/

SettingsStore.FlexSlide.Simple = {
	ui: { wrap: { 'class': 'ui-Wrap simpleSlide' } },
	autoItemSize: { x: true, y: true },
	getSizeFromContainer: false,
	render: ['description', 'previous', 'item', 'next', 'advSelect']
};