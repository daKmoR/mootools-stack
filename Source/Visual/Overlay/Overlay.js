/*
---
name: Overlay
description: creates a semi-transparent layer that fades in/out
license: MIT-style license.
requires: [Core/Fx.Tween]
provides: Overlay

...
*/ 

var Overlay = new Class({

	Implements: [Options, Events],
	options: {
		overlay: { 'class': 'ui-Overlay', 'style': 'position: fixed; left: 0; top: 0; width: 100%; background: #000;' },
		opacity: 0.7,
		container: null,
		onBuild: function(overlay) { overlay.setStyles({ opacity: 0, display: 'block'}); },
		onShow: function(overlay)  { overlay.setStyle('display', 'block'); this.fx.start(this.options.opacity); },
		onHide: function(overlay)  { 
			this.fx.start(0).chain(function() {
				overlay.setStyle('display', 'none'); 
			});
		},
		onClick: function() {}
	},

	initialize: function(options){
		this.setOptions(options);
		this.options.container = !this.options.container ? $(document.body) : $(this.options.container);
	},
	
	build: function() {
		this.overlay = new Element('div', this.options.overlay).inject(this.options.container);
		this.fx = new Fx.Tween(this.overlay, {property: 'opacity'});
		
		this.overlay.addEvent('click', function(){
			this.fireEvent('click');
		}.bind(this));
		
		this.position();
		if( this.options.container == document.body ){
			window.addEvent('resize', this.position.bind(this) );
		}
		this.fireEvent('build', this.overlay);
	},
	
	position: function(){
		if( this.options.container == document.body ){
			this.overlay.setStyle('height', window.getScrollSize().y); 
		} else {
			if( this.options.container.getStyle('position') === 'static' ) {
				this.options.container.setStyle('position', 'relative');
			}
			this.overlay.setStyle('height', this.options.container.getSize().y); 
		}
	},
	
	show: function() {
		if( this.overlay ) {
			this.fireEvent('show', this.overlay);
		} else {
			this.build();
			this.show();
		}
	},
	
	hide: function() {
		this.fireEvent('hide', this.overlay);
	}
	
});