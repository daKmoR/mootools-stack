/*
---

name: FlexBox

description: let you use FlexSlide as a LighBox with zoom effect

license: MIT-style license.

requires: [FlexSlide.Advanced, Overlay]

provides: FlexBox

...
*/

var FlexBox = new Class({

	Implements: [Settings, Events],

	options: {/*
		onOpen: nil,
		onOpenEnd: nil,
		onClose: nil,
		onCloseEnd: nil,*/
		opacityZoom: 0.8,
		centerZoom: false,
		useOverlay: true,
		margin: 40,
		anchor: false,
		wrap: false,
		singleMode: true,
		manualClose: false,
		position: {},
		active: true,
		ui: {
			wrap: { 'class': 'flexBoxWrap' },
			content: { 'class': 'content' }
		},
		keyboardListener: true,
		flexSlide: {
			render: [{ 'bottom': ['next', 'previous'] }, 'item', 'close'],
			autoContainerSize: { x: true, y: true },
			centerItem: false,
			positionContainer: true,
			getSizeFromElement: false,
			auto: false,
			dynamicLoading: true,
			wheelListener: true,
			keyboardListener: true,
			active: true,
			ui: {
				close: { 'class': 'ui-Close' }
			},
			effect: {
				up: 'random',
				down: 'random',
				random: ['fade'],
				options: {
					zoom: { duration: 600, transition: Fx.Transitions.Quart.easeOut },
					dezoom: { duration: 600, transition: Fx.Transitions.Quart.easeOut }
				}
			},
			effects: {
				fadeIn: function(current, next, currentEl, nextEl) {
					$extend(this.wrapFxConfig[1], { 'opacity': [0, 1] });
				},
				fadeOut: function(current, next, currentEl, nextEl) {
					$extend(this.wrapFxConfig[1], { 'opacity': [1, 0] });
				}
			}
		},
		openOptions: {
			effect: {	up: 'fadeIn',	down: 'fadeIn', random: ['fadeIn'] }
		},
		closeOptions: {
			effect: { up: 'fadeOut', down: 'fadeOut',	random: ['fadeOut']	}
		}
	},
	
	isOpen: false,

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
				this.open(this.anchor);
				
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
		if( this.isOpen ) return false;
		var id = typeOf(id) === 'element' ? this.anchors.indexOf(id) : id;
		
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
		
		this.isOpen = true;
		this.options.active = true;
		this.flexSlide.options.active = true;
	},
	
	build: function() {
		if( this.options.useOverlay ) {
			this.overlay = new Overlay({ onClick: this.close.bind(this) });
			this.overlay.build();
		}
	
		this.wrap = this.options.wrap || new Element('div', this.options.ui.wrap).inject(document.body);
		
		this.animPadding = this.wrap.getStyle('padding').toInt();
		this.wrap.setStyle('padding', 0);
		
		this.anchors.each(function(el) {
			this.wrap.grab( el.clone().addClass('item') );
		}, this);
		
		this.flexSlide = new FlexSlide.Advanced( this.wrap, $merge(this.options.flexSlide, {
			buildOnInit: false
		}) );
		this.flexSlide.build();
		this.flexSlide.addEvent('onImageLoaded', function(image) {
			this.fireEvent('imageLoaded', image);
		}.bind(this) );
		
		this.flexSlide.addEvent('onLoaded', function(div) {
			this.fireEvent('loaded', div);
		}.bind(this) );
		
		this.wrap.position( $merge(this.flexSlide.options.positionContainerOptions, {returnPos: false}) );
		
		if( this.options.keyboardListener ) {
			document.addEvent('keydown', this.keyboardListener.bindWithEvent(this));
		}
		
		if( this.flexSlide.closeWrap ) {
			this.flexSlide.closeWrap.addEvent('click', this.close.bind(this) );
		}
		
	},
	
	close: function() {
		this.fireEvent('onClose');
		this.flexSlide.running = true;
		
		if( !this.options.manualClose ) {
			this._close();
		}
	},
	
	_close: function() {
		this.closeEndEvent = this.closeEnd.pass(null, this);
		this.flexSlide.addEvent('onShowEnd', this.closeEndEvent );
		
		this.flexSlide.setOptions(this.options.closeOptions);
		
		var tmp = this.flexSlide.current;
		this.flexSlide.current = -1;

		this.flexSlide.running = false;
		this.flexSlide.show(tmp);
		this.flexSlide.running = true;
		
		if(this.options.useOverlay) {
			this.overlay.hide();
		}
	},
	
	closeEnd: function() {
		this.fireEvent('onCloseEnd');
		this.flexSlide.wrap.setStyle('display', 'none');
		this.flexSlide.elements.item[this.flexSlide.current].set('style', '');
		
		this.flexSlide.removeEvent('onShowEnd', this.closeEndEvent);
		
		
		this.isOpen = false;
		this.options.active = false;
		this.flexSlide.options.active = false;
		this.flexSlide.running = false;
	},

	keyboardListener: function(event) {
		if (!this.options.active) return;
		//if(event.key != 'f5') event.preventDefault();
		switch (event.key) {
			case 'esc': case 'x': case 'q': this.close(); break;
		}
	}
	
	
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