/*
---

name: Setting.FlexSlide.SlideShow2

description: mimics the "original" SlideShow2 Theme

license: MIT-style license.

requires: [FlexSlide]

provides: [Setting.FlexSlide.SlideShow2]

...
*/

SettingsStore.FlexSlide = SettingsStore.FlexSlide || {};

SettingsStore.FlexSlide.SlideShow2 = {
	ui: {	wrap: { 'class': 'ui-Wrap slideShow2' } },
	render: [{'outer': ['item', { 'controls': ['first', 'previous', 'pause', 'next', 'last'] }, 'description', 'advSelect', 'overlayLeft', 'overlayRight']} ],
	duration: 4000,
	auto: true,
	selectTemplate: '',
	getSizeFromContainer: false,
	getSizeFromElement: false,
	onBuild: function() {
		// no build in functionality for first and last image, so we need to add it manually
		this.firstWrap.addEvent('click', function() {
			this.show(0);
		}.bind(this) );
		this.lastWrap.addEvent('click', function() {
			this.show( this.elements.item.length-1 )
		}.bind(this) );
		
		// pause & resume functionality
		this.pauseWrap.addEvent('click', function() {
			if( this.options.auto ) {
				this.options.auto = false;
				$clear(this.autotimer);
				this.pauseWrap.setStyle('background-position', '20px 0');
			} else {
				this.options.auto = true;
				this.pauseWrap.setStyle('background-position', '0 0');
				this.auto();
			}
		}.bind(this) );
		
		// shows and hides the control
		this.controlsWrap.fade('hide');
		this.itemWrap.addEvent('mouseenter', function(e) {
			this.controlsWrap.fade(1);
		}.bind(this) );
		this.wrap.addEvent('mouseleave', function() {
			this.controlsWrap.fade(0);
		}.bind(this) );
		
		this.elements.select.fade(0.3);
	},
	onSelectChange: function(currentEl, nextEl) {
		// only the active element is shown with full opacity
		currentEl.fade(0.3);
		nextEl.fade(1);
	}
}