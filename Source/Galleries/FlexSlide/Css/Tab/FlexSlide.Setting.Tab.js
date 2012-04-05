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
	size: { height: 'auto' },
	render: ['select', 'item'],
	effect: { up: 'slideLeftQuart', down: 'slideRightQuart' }
};