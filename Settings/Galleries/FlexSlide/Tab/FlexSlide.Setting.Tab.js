/*
---

name: FlexSlide.Setting.Tab

description: a TabVertical style for FlexSlide

license: MIT-style license.

requires: [FlexSlide]

provides: [FlexSlide.Setting.Tab]

...
*/

SettingsStore.FlexSlide = SettingsStore.FlexSlide || {};

SettingsStore.FlexSlide.Tab = {
	selections: {
		'item': '.tab',
		'select': '.tabTitle'
	},
	auto: false,
	getSizeFromContainer: false,
	getSizeFromElement: false,
	autoContainerSize: { x: false, y: true },
	centerItem: false,
	render: ['select', 'item'],
	effect: { up: 'slideLeftQuart', down: 'slideRightQuart' }
};