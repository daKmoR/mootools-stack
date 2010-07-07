/*
---

name: FlexBox

description: let you use FlexSlide as a LighBox with zoom effect

license: MIT-style license.

requires: [FlexSlide.Advanced, Overlay]

provides: FlexBox

...
*/

/*
$require('Galleries/FlexBox/Resources/css/FlexBox.css');
*/

var FlexBox = new Class({

	Implements: [Options, Events],

	options: {
		opacityZoom: 0.8,
		centerZoom: false,
		useOverlay: true,
		margin: 40,
		anchor: false,
		wrap: false,
		singleMode: true,
		position: {},
		active: true,
		ui: {
			wrap: { 'class': 'flexBoxWrap' },
			content: { 'class': 'content' }
		},
		keyboardListener: true,
		flexSlide: {
			render: [{ 'bottom': ['next', 'previous'] }, 'item', 'close'],
//			autoContainerSize: { x: false, y: false },
			autoContainerSize: { x: true, y: true },
			centerItem: false,
			
			positionContainer: true,
			
			auto: false,
			dynamicLoading: true,
			wheelListener: true,
			keyboardListener: true,
			active: true,
			ui: {
				close: { 'class': 'ui-Close' }
			},
			effect: {
				random: ['fade'],
				options: {
					zoom: { duration: 600, transition: Fx.Transitions.Quart.easeOut },
					dezoom: { duration: 600, transition: Fx.Transitions.Quart.easeOut }
				}
			},
			effects: {
				fadeIn: function(current, next, currentEl, nextEl) {
					this.fxConfig[next]    = { 'opacity': [0, 1] };
				},
				fadeOut: function(current, next, currentEl, nextEl) {
					this.fxConfig[next]    = { 'opacity': [1, 0] };
				}
			}
		},
		openOptions: {
			effect: {
				random: ['fadeIn']
			}
		},
		closeOptions: {
			effect: {
				random: ['fadeOut']
			}
		},
		onOpen: function() {
			// this.flexSlide.bottomWrap.fade('hide');
			this.flexSlide.closeWrap.fade('hide');
		},
		onOpenEnd: function() {
			// if( $chk(this.flexSlide.bottomWrap) ) {
				// this.flexSlide.bottomWrap.fade(1);
			// }
			if( $chk( this.flexSlide.closeWrap ) ) {
				this.flexSlide.closeWrap.fade(1);
				this.flexSlide.closeWrap.addEvent('click', this.fireEvent.bind(this, 'onCloseStart') );
			}
		},
		onCloseStart: function() {
			if( !this.flexSlide.running ) {
				this.flexSlide.closeWrap.fade(0);
				this.close();
				// this.flexSlide.bottomWrap.fade(0).get('tween').chain( function() {
					// this.close();
				// }.bind(this) );
			}
		},
		onCloseEnd: function() {
			// if( $defined(this.flexSlide.els.description) ) {
				// this.flexSlide.els.description.set('style', '');
			// }
		}
		/* onClose */
	},

	initialize: function(anchors, options){
		this.setOptions(options);
		this.anchors = $$(anchors);
		
		if( this.options.wrap || this.options.anchor ) {
			this.options.singleMode = true;
		}
		
		if ( !this.options.singleMode ) {
			this.anchor = $(this.options.anchor);
			this.anchor.addEvent('click', function(e) {
				e.stop();
				this.open( this.anchors.indexOf(this.anchor) );
				
			}.bind(this) );
			
		} else {
		
			this.anchors.each( function(el, i) {
				el.addEvent('click', function(e) {
					e.stop();
					this.open(i);
					
				}.bind(this) );
			}, (this) );
			
		}

	},
	
	open: function(id) {
		// var animPadding = this.animPadding;
		// var fxOptions = this.options.flexSlide.effect.options.zoom;
		
		if( $defined(this.flexSlide) ) {
			if( this.options.useOverlay ) {
				this.overlay.show();
			}
			this.flexSlide.setOptions( this.options.openOptions );
			
			this.openEndEvent = this.openEnd.pass(null, this);
			this.flexSlide.addEvent('onShowEnd', this.openEndEvent );
			
			this.flexSlide.wrap.setStyle('display', 'block');
			
			this.flexSlide.current = -1;
			this.flexSlide.show( id );
			
			this.fireEvent('onOpen');
		} else {
			this.build();
			
			this.open(id);
		}
	},
	
	openEnd: function() {
		this.fireEvent('onOpenEnd');
		this.flexSlide.setOptions( this.options.flexSlide );
		this.flexSlide.removeEvent('onShowEnd', this.openEndEvent );
	},
	
	build: function() {
		if( this.options.useOverlay ) {
			this.overlay = new Overlay({ onClick: this.fireEvent.bind(this, 'onCloseStart') });
			this.overlay.build();
		}
	
		this.wrap = this.options.wrap || new Element('div', this.options.ui.wrap).inject(document.body);
		//this.wrap.empty();
		
		//var coords = this.options.wrap.getCoordinates();
		//this.wrap = new Element('div', this.options.ui.wrap).inject(document.body);
		
		//this.wrap = this.options.wrap.set(this.options.ui.wrap).inject(document.body);
		
		
		// this.wrap.setStyles({
			// 'left': coords.left,
			// 'top': coords.top,
			// 'width': coords.width,
			// 'height': coords.height
		// });
		
		this.animPadding = this.wrap.getStyle('padding').toInt();
		this.wrap.setStyle('padding', 0);
		
		this.anchors.each(function(el) {
			this.wrap.grab( el.clone().addClass('item') );
		}, this);
		
		//this.wrap.position();
		
		this.flexSlide = new FlexSlide.Advanced( this.wrap, $merge(this.options.flexSlide, {
			show: -1
		}) );
		this.flexSlide.build();
		
		if( this.options.keyboardListener ) {
			document.addEvent('keydown', this.keyboardListener.bindWithEvent(this));
		}
		
	},
	
	close: function() {
		this.closeEndEvent = this.closeEnd.pass(null, this);
		this.flexSlide.addEvent('onShowEnd', this.closeEndEvent );
		
		this.flexSlide.setOptions( this.options.closeOptions );
		
		var tmp = this.flexSlide.current;
		this.flexSlide.current = -1;
		this.flexSlide.show( tmp );
		
		if( this.options.useOverlay ) {
			this.overlay.hide();
		}
		
		this.fireEvent('onClose');
	},
	
	closeEnd: function() {
		this.fireEvent('onCloseEnd');
		this.flexSlide.wrap.setStyle('display', 'none');
		this.flexSlide.els.item[this.flexSlide.current].set('style', '');
		
		this.flexSlide.removeEvent('onShowEnd', this.closeEndEvent );
	},

	keyboardListener: function(event){
		if(!this.options.active) return;
		//if(event.key != 'f5') event.preventDefault();
		switch (event.key) {
			case 'esc': case 'x': case 'q': this.close(); break;
		}
	},
	
	
	// OPEN ZOOM
	
			// this.coords = this.anchor.getElement('img') ? this.anchor.getElement('img').getCoordinates() : this.anchor.getCoordinates();
			// this.wrap.setStyles({
				// 'left': this.coords.left,
				// 'top': this.coords.top
			// });
			// this.flexSlide.itemWrap.setStyles({
				// 'width': this.coords.width,
				// 'height': this.coords.height
			// });
			// this.wrap.setStyle('display', 'block');
			
			// this.flexSlide.setOptions( $merge(this.options.flexSlide, {
				// positionContainer: this.options.centerZoom,
				// opacityZoom: this.options.opacityZoom,
				// margin: this.options.margin,
				// effect: { random: ['zoom'] },
				// effects: {
					// zoom: function(current, next, currentEl, nextEl) {
						
						// var to = this.options.fixedSize || nextEl.getSize();
						// console.log( to );
						// this.fxConfig[next] = {
							// 'width': [currentEl.getSize().x, to.x],
							// 'height': [currentEl.getSize().y, to.y]
						// };
						
						// var pos = { x: 0, y: 0 };
						// if( !this.options.positionContainer ) {
							// var box = this.options.container.getSize(), scroll = this.options.container.getScroll(), localCoords = this.wrap.getCoordinates();
							// pos = {
								// x: (localCoords.left + (localCoords.width / 2) - to.x / 2).toInt()
									// .limit(scroll.x + this.options.margin, scroll.x + box.x - this.options.margin - to.x),
								// y: (localCoords.top + (localCoords.height / 2) - to.y / 2).toInt()
									// .limit(scroll.y + this.options.margin, scroll.y + box.y - this.options.margin - to.y)
							// }
						// }
						// this.wrapFx.setOptions(fxOptions);
						// this.wrapFxConfig[1] = {
							// 'padding': [0, animPadding],
							// 'left': pos.x,
							// 'top': pos.y,
							// 'opacity': [this.options.opacityZoom, 1]
						// };
					// }
				// }
			// }) );	
			
			
		// CLOSE ZOOM
			
		// var localCoords = this.anchors[this.flexSlide.current].getElement('img') ? this.anchors[this.flexSlide.current].getElement('img').getCoordinates() : this.anchors[this.flexSlide.current].getCoordinates();
		// var animPadding = this.animPadding;
		// var fxOptions = this.options.flexSlide.effect.options.dezoom;
		
		// this.flexSlide.setOptions( $merge(this.options.flexSlide, {
			// autoContainerSize: { x: false, y: false },
			// positionContainer: false,
			// opacityZoom: this.options.opacityZoom,
			// effect: { random: ['dezoom'] },
			// effects: {
				// dezoom: function(current, next, currentEl, nextEl) {
					// this.wrapFx.setOptions( fxOptions );
					// this.wrapFxConfig[0] = {
						// 'width': localCoords.width,
						// 'height': localCoords.height
					// };
					// this.wrapFxConfig[1] = {
						// 'padding': [animPadding, 0],
						// 'left': localCoords.left,
						// 'top': localCoords.top,
						// 'opacity': [1, this.options.opacityZoom]
					// };
					// this.fxConfig[current] = {
						// 'width': [currentEl.getSize().x, localCoords.width],
						// 'height': [currentEl.getSize().y, localCoords.height]
					// };
				// }
			// }
		// }) );			

});