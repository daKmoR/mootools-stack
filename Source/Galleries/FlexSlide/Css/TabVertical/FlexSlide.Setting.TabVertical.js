/*
---

name: FlexSlide.Setting.TabVertical

description: a TabVertical style for FlexSlide

license: MIT-style license.

requires: [FlexSlide]

provides: [FlexSlide.Setting.TabVertical]

...
*/

SettingsStore.FlexSlide = SettingsStore.FlexSlide || {};

SettingsStore.FlexSlide.TabVertical = {
	selections: {
		'item': '.tab',
		'select': '.tabTitle'
	},
	auto: false,
	getSizeFromContainer: false,
	getSizeFromElement: false,
	autoContainerSize: { x: false, y: true },
	centerItem: false,
	render: ['select', 'item', 'clear'],
	effect: { up: 'slideTopQuart', down: 'slideBottomQuart' }
};