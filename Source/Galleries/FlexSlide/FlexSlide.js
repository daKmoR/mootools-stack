/*
---

name: FlexSlide

description: allows to create almost any Sliding Stuff (Galleries, Tabs...) with multiple effects

license: MIT-style license.

requires: [Core/Element.Dimensions, Core/Element.Style, Core/Fx.Tween, Core/Fx.Morph, Core/Fx.Transitions, More/Fx.Elements, More/Scroller, More/Fx.Scroll, More/Element.Position, Class.Settings, Gallery, More/Assets]

provides: FlexSlide

...
*/ 

Array.implement({
	getCombinedSize: function(margin, padding, border){
		var margin = margin || true;
		var padding = padding || true;
		var border = border || true;
		var elsWidth = 0, elsHeight = 0, size;
		for (var i = 0, l = this.length; i < l; i++){
			size = { x: this[i].getStyle('width').toInt(), y: this[i].getStyle('height').toInt() };
			
			elsWidth += size.x + (margin ? this[i].getStyle('margin-left').toInt() + this[i].getStyle('margin-right').toInt() : 0);
			elsHeight += size.y + (margin ? this[i].getStyle('margin-top').toInt() + this[i].getStyle('margin-bottom').toInt() : 0);
			
			elsWidth += padding ? this[i].getStyle('padding-left').toInt() + this[i].getStyle('padding-right').toInt() : 0;
			elsHeight += padding ? this[i].getStyle('padding-top').toInt() + this[i].getStyle('padding-bottom').toInt() : 0;
			
			elsWidth += border ? this[i].getStyle('border-left').toInt() + this[i].getStyle('border-right').toInt() : 0;
			elsHeight += border ? this[i].getStyle('border-top').toInt() + this[i].getStyle('border-bottom').toInt() : 0;
		}
		return {x: elsWidth, y: elsHeight};
	}
});

var FlexSlide = new Class({
	Implements: [Settings, Events, Gallery],
	options: {
		selections: {}, /* item: '.myOtherItemClass' you can define your own css classes here */
		render: ['item'], // special elements are: ['item', 'counter', 'next', 'previous', 'select', 'advSelect', 'selectScroller', 'start', 'stop', 'toggle']
		render: ['item', 'next', 'previous'], // special elements are: ['item', 'counter', 'next', 'previous', 'select', 'advSelect', 'selectScroller', 'start', 'stop', 'toggle']
		ui: {
			wrap: { 'class': 'ui-Wrap' },
			selectItem: { 'class': 'ui-SelectItem' },
			descriptionItem: { 'class': 'ui-DescriptionItem' }
		},
		show: 0,
		buildOnInit: true,
		initFx: 'display',
		container: null,
		size: null, // { x: 500, y: 500 }
		size: { x: 500, y: 300 },
		getSizeFrom: 'none', // ['none', 'element', 'element[x]', 'wrap'] element uses the show element
		itemSize: 'scale', // ['none', 'scale', 'crop', 'same']
		itemSizeOverride: {
			div: 'same'
		},
		itemPosition: { position: 'center' },
		itemPositionOverride: {
			div: { position: 'leftTop' }
		},
		
		/* replace, use... */ 
		resetIframeOnChange: true,
		getSizeFromContainer: false,
		
		/* remove */
		getSizeFromElement: 'auto', // ['auto', -1, id] 'auto' same as show, -1 to not use it
		setSizeForContainer: false,
		fixedSize: false, // {x: 640, y: 640}
		resizeFactor: 0.95,
		resizeLimit: false, // {x: 640, y: 640}
		auto: false,
		centerItem: true,
		
		autoItemSize: { mode: 'scale', x: true, y: true },
		autoItemSizeSpecial: ['img', 'a'],
		centerItemTags: ['img', 'a'],
		autoContainerSize: { x: false, y: false },
		positionContainer: false,
		positionContainerOptions: {
			ignoreOffsetParent: true,
			ignoreAllScroll: true,
			returnPos: true
		},
		useScroller: false,
		scrollerMode: 'horizontal',
		scrollerOptions: { area: 100, velocity: 0.1 },
		scrollOptions: { offset: {x: 0, y: 0}, wheelStops: false },
		scrollToSelected: true,
		selectTemplate: '{text}',
		counterTemplate: '{id}/{count}',
		descriptionTemplate: '<strong>{title}</strong><span>{text}</span>',
		effect: {
			up: 'random', /* any availabele effect */
			down: 'random', /* any availabele effect */
			random: ['fade'],
			globalOptions: { duration: 1000, transition: Fx.Transitions.linear },
			options: { display: { duration: 0 }	},
			wrapFxOptions: { duration: 1000, transition: Fx.Transitions.Quart.easeInOut }
		},
		effects: {
			fade: function(current, next, currentEl, nextEl) {
				this.fxConfig[current] = { 'opacity': [1, 0] };
				this.fxConfig[next]    = { 'opacity': [0, 1] };
			},
			display: function(current, next, currentEl, nextEl) {
				this.wrapFx.setOptions({ duration: 0 });
				if (currentEl) {
					currentEl.setStyle('display', 'none');
				}
				nextEl.setStyle('display', 'block');
			}
		},
		onShow: function(current, next) {
			if( $defined(this.elements.description) ) {
				this.elements.description[current].setStyle('display', 'block').fade(0);
				this.elements.description[next].fade('hide').setStyle('display', 'block').fade(1);
			}
		}
		/*onBuild, onSelectChange(currentEl, nextEl) */
	},
	
	current: -1,
	running: false,
	autotimer: $empty,
	elements: {},
	fxConfig: {},
	wrapFxConfig: {},
	
	initialize: function(wrap, options) {
		if (!(this.wrap = $(wrap))) return;
		this.setOptions(options);
		
		if (this.options.container == undefined) {
			this.options.container = this.wrap.getParent();
		}
		
		if( this.options.buildOnInit === true ) {
			this.build();
		}
		
		if( this.options.show === 'random' ) {
			this.options.show = $random(0, this.elements.item.length-1);
		}
		
		if( this.options.buildOnInit === true && this.options.show >= 0 && this.options.show < this.elements.item.length ) {
			this.show( this.options.show, this.options.initFx );
		}
	},
	
	guessSize: function() {
		if (!this.options.size) {
			if (this.options.getSizeFrom !== 'none') {
			
				// element
				if (this.options.getSizeFrom === 'element') {
					this.options.getSizeFrom = this.options.show;
				}
				
				// element[x]
				if (this.options.getSizeFrom >= 0 && this.options.getSizeFrom < this.elements.item.length ) {
					var img = Asset.image(this.elements.item[this.options.getSizeFrom].get('src'), {
						onLoad: function() {
							this.itemWrap.grab(this.elements.item[this.options.getSizeFrom]);
							
							this.options.size = this.elements.item[this.options.getSizeFrom].getSize();
							this.itemWrap.setStyle('width', this.options.size.x).setStyle('height', this.options.size.y);
							
							this.elements.item[this.options.getSizeFrom].dispose();
							
						}.bind(this)
					});
				}
				
				// container
				if (this.options.getSizeFrom === 'wrap') {
					this.options.size = this.wrap.getSize();
					this.itemWrap.setStyle('width', this.options.size.x).itemWrap.setStyle('height', this.options.size.y);
				}
				
			}
			
		} else {
			this.itemWrap.setStyle('width', this.options.size.x).setStyle('height', this.options.size.y);
		}
	},
	
	build: function() {
		this.builder( this.options.render, this.wrap );
		
		//automatically build the select if no costum select items are found
		if( $chk(this.elements.select) && this.elements.select.length <= 0 ) {
			this.elements.item.each( function(el, i) {
				var select = new Element('div', this.options.ui.selectItem)
					.addEvent('click', this.show.bind(this, i))
					.inject(this.selectWrap);
					
				var text = el.get('alt') || el.get('title') || '';
				select.set('html', this.options.selectTemplate.substitute({id: i+1, text: text}));
				this.elements.select.push(select);
			}, this);
		}
		
		// description stuff
		if( $chk(this.elements.description) && this.elements.description.length <= 0 ) {
			this.elements.item.each( function(el, i) {
				var description = new Element('div', this.options.ui.descriptionItem)
					.inject(this.descriptionWrap);
				
				var txt = el.get('title') || el.get('alt') || false;
				if( !txt && el.getElement('img') )
					txt = el.getElement('img').get('alt');
				
				if( txt && txt != null ) {
					var parts = txt.split('::');
					if( parts.length === 2 )
						txt = this.options.descriptionTemplate.substitute( {'title': parts[0], 'text': parts[1]} );
					if( txt.charAt(0) === '#' ) 
						txt = $$(txt)[0].get('html');
					description.set('html', txt);
				}
				
				this.elements.description.push(description);
			}, this);
			
		}
		
		this.fx = new Fx.Elements(this.elements.item);
		this.wrapFx = new Fx.Elements([this.itemWrap, this.wrap]);
		
		this.updateCounter(0);
		this.wrap.addClass( this.options.ui.wrap['class'] );
		
		this.guessSize();
		
		if (this.nextWrap) {
			this.nextWrap.addEvent('click', this.next.bind(this, this.options.times) );
		}
		if (this.previousWrap) {
			this.previousWrap.addEvent('click', this.previous.bind(this, this.options.times) );
		}
		
		if (this.startWrap) {
			this.startWrap.addEvent('click', this.start.bind(this) );
		}
		if (this.stopWrap) {
			this.stopWrap.addEvent('click', this.stop.bind(this) );
		}
		if (this.toggleWrap) {
			this.toggleWrap.addEvent('click', this.toggle.bind(this) );
		}
		
		if( this.options.useScroller == true ) {
			if( this.options.scrollerMode === 'horizontal' )
				this.selectWrap.setStyle('width', this.selectWrap.getChildren().getCombinedSize().x);
			if( this.options.scrollerMode === 'vertical' )
				this.selectWrap.setStyle('height', this.selectWrap.getChildren().getCombinedSize().y);
			this.scroller = new Scroller( this.selectWrap.getParent(), this.options.scrollerOptions).start();
			this.scroll = new Fx.Scroll(this.selectScrollerWrap, this.options.scrollOptions);
		}
		
		this.fireEvent('onBuild');
	},
	
	buildElement: function(item, wrapper) {
		if( !$chk(this.options.ui[item]) )
			this.options.ui[item] = { 'class': 'ui-' + item.capitalize() };
		if( !$chk(this.options.selections[item]) )
			this.options.selections[item] = '.' + item;
		this.elements[item] = this.wrap.getElements( this.options.selections[item] );
		this[item + 'Wrap'] = new Element('div', this.options.ui[item]).inject( wrapper );
		
		if( this.elements[item].length > 0 ) {
			this.elements[item].each( function(el, i) {
				if( item == 'select' ) {
					el.addEvent('click', this.show.bind(this, i) );
					if( el.get('tag') !== 'img' ) {
						el.set('html', this.options.selectTemplate.substitute({id: i+1, text: el.get('html')}) );
					}
				}
				if( !$chk(this.options.ui[item + 'Item']) )
					this.options.ui[item + 'Item'] = { 'class': 'ui-' + item.capitalize() + 'Item' };
				el.addClass( this.options.ui[item + 'Item']['class'] );
				//this[item + 'Wrap'].grab(el);
				this.elements[item][i] = el.dispose();
				//console.log('dispose', this.elements[item][i].get('class'));
			}, this);
		}
	},
	
	builder: function(els, wrapper) {
		$each( els, function(item, i) {
			if (item === 'advSelect') {
				els[i] = item = {'selectScroller' : ['select']};
				this.options.useScroller = true;
			}
			if( $type(item) !== 'object' ) {
				this.buildElement(item, wrapper);
			} else {
				$each( item, function(el, i) {
					this.buildElement(i, wrapper);
					this.builder(el, this[i + 'Wrap']);
				}, this);
			}
		}, this);
	},
	
	show: function(id, fx) {
		if (this.itemWrap) {
			this._show(id, fx);
		} else {
			this.build();
			this._show(id, fx);
		}
	},
	
	_show: function(id, fx) {
		if( (id != this.current || this.current === -1) && this.running === false ) {
			var fx = fx || ( (id > this.current) ? this.options.effect.up : this.options.effect.down);
			if(fx === 'random') fx = this.options.effect.random.getRandom();
			
			var newOptions = $unlink(this.options.effect.globalOptions);
			$extend( newOptions, this.options.effect.options[fx] );
			this.fx.setOptions( newOptions );
			this.wrapFx.setOptions( this.options.effect.wrapFxOptions );
			
			//console.log('show', this.current + ' -> ' + id);
			
			if (this.current >= 0) {
				this.prepareCurrent(this.current);
			}
			this.prepareElement(id, fx);
			
			this.fxConfig = {};
			this.wrapFxConfig = {};
			if( this.options.autoContainerSize.x || this.options.autoContainerSize.y )
				this.wrapFxConfig[0] = {};
			if( this.options.autoContainerSize.x )
				$extend(this.wrapFxConfig[0], {'width': this.elements.item[id].getSize().x} );
			if( this.options.autoContainerSize.y )
				$extend(this.wrapFxConfig[0], {'height': this.elements.item[id].getSize().y} );

			if( this.options.positionContainer )
				this.positionContainer(id);
				
				
			
			// var tmp = {'display': 'block'};
			// if( $defined(this.fxConfig[id]) ) {
				// $each( this.fxConfig[id], function(values, property) {
					// tmp[property] = values[0];
				// });
				// this.elements.item[id].setStyles(tmp);
			// }

			this.fireEvent('onShow', [this.current, id]);
			
			// this.wrapFx.start(this.wrapFxConfig).chain( function() {
				// this.fx.start(this.fxConfig)
			// }.bind(this) );
			
			
		}
	},
	
	transition: function(old, id, fx) {
		//if (this.current < 0) return;
		console.log('trans', old + ' -> ' + id + ' [' + this.current + ']');
		
		if (this.options.effects[fx + 'Prepare']) {
			this.options.effects[fx + 'Prepare'].call( this, this.current, id, this.elements.item[this.current], this.elements.item[id]);
		}
		
		// call the used effect
		this.options.effects[fx].call(this, this.current, id, this.elements.item[this.current], this.elements.item[id]);

		this.running = true;
		var oldcurrent = this.current;
		this.fx.elements = this.fx.subject = this.elements.item;
		
		console.log('el', this.elements.item[this.current].getElement('h2').get('text') + ' -> ' + this.elements.item[id].getElement('h2').get('text'));
		console.log('el-style', this.elements.item[this.current].getStyle('left') + ' -> ' + this.elements.item[id].getStyle('left'));
		console.log(this.fxConfig);
		
		this.fx.start(this.fxConfig).chain(function() {
			this.running = false;
			this.showEnd(oldcurrent);
		}.bind(this));
		
		this.wrapFx.start(this.wrapFxConfig);
		
		this.process(id);
	},
	
	showEnd: function(oldcurrent) {
	
		// "reset" iframe src to stop started flash videos
		if (this.elements.item[oldcurrent].get('tag') === 'iframe' && this.options.resetIframeOnChange) {
			this.elements.item[oldcurrent].set('src', this.elements.item[oldcurrent].get('src'));
		}
		
		//this.elements.item[oldcurrent] = this.elements.item[oldcurrent].dispose();
		
		this.fireEvent('onShowEnd');
	},
	
	resetElement: function(el) {
		if (!el.retrieve('FlexSlide:ElementStyle')) {
			el.setStyle('display', 'block');
			el.store('FlexSlide:ElementStyle', el.get('style'));
		}
		el.set('style', el.retrieve('FlexSlide:ElementStyle'));
	},
	
	prepareCurrent: function(el) {
		var  i = typeOf(el) === 'number' ? el : this.elements.item.indexOf(el);
		var el = this.elements.item[i];
		
		this.resetElement(el);
		this.elements.item[i] = el;
		this.adjustElement(el);
	},
	
	prepareElement: function(el, fx) {
		var  i = typeOf(el) === 'number' ? el : this.elements.item.indexOf(el);
		var el = this.elements.item[i];
		
		this.resetElement(el);
		if (el.get('tag') === 'img') {
			var img = Asset.image(el.get('src'), {
				onLoad: function() {
					img.set('style', el.get('style'));
					img.set('class', el.get('class'));
					el.dispose();
					img.inject(this.itemWrap);
					this.elements.item[i] = img;
					this.adjustElement(img);
					
					if (this.current >= 0) {
						this.transition(this.current, i, fx);
					} else {
						this.process(i);
					}
				}.bind(this)
			});
		} else {
			el.inject(this.itemWrap);
			this.elements.item[i] = el;
			this.adjustElement(el);
			if (this.current >= 0) {
				this.transition(this.current, i, fx);
			} else {
				this.process(i);
			}
		}
		
	},
	
	disposeLast: function(el) {
		var el = typeOf(el) !== 'element' ? this.elements.item[el] : el;
		
		if (!el.retrieve('FlexSlide:ElementStyle')) {
			el.setStyle('display', 'block');
			el.store('FlexSlide:ElementStyle', el.get('style'));
		}
		el.set('style', el.retrieve('FlexSlide:ElementStyle') );
	},
	
	adjustElement: function(el) {
		var el = typeOf(el) !== 'element' ? this.elements.item[el] : el;
		
		var itemSize = this.options.itemSizeOverride[el.get('tag')] || this.options.itemSize;
		if (itemSize === 'none') {
			return;
		} else if (itemSize === 'same') {
			el.erase('width').erase('height');
			el.setStyle('width', this.options.size.x).setStyle('height', this.options.size.y);
		} else {
		
			var itemPosition = Object.clone(this.options.itemPosition);
			if (itemPositionOverride = this.options.itemPositionOverride[el.get('tag')]) {
				Object.merge(itemPosition, itemPositionOverride);
			}
			
			//var scrollSize = $(document.body).getScrollSize();
			//itemSize = 'crop';
			//this.options.itemPosition.position = 'left';

			var size = this.itemWrap.getSize(), elSize = el.getSize();
			if (itemSize === 'cropScroll' || itemSize === 'scaleScroll') {
				size = this.itemWrap.getScrollSize();
			}
			var ratiox = size.x / elSize.x, ratioy = size.y / elSize.y;
			
			if (itemSize === 'scale') {
				var ratio = ratioy < ratiox ? ratioy : ratiox;
			} else if (itemSize === 'crop') {
				var ratio = ratioy > ratiox ? ratioy : ratiox;
			}
			
			el.erase('width').erase('height');
			el.setStyle('width', elSize.x * ratio).setStyle('height', elSize.y * ratio);
			
			if (itemSize === 'scale') {
				var returnPos = el.calculatePosition(Object.merge({relativeTo: this.itemWrap}, itemPosition));
				if (returnPos.left !== 0) {
					el.setStyle('margin-left', returnPos.left).setStyle('margin-right', returnPos.left);
				}
				if (returnPos.top !== 0) {
					el.setStyle('margin-top', returnPos.top).setStyle('margin-bottom', returnPos.top);
				}
			} else if (itemSize === 'crop' && itemPosition.position === 'center') {
				el.setStyle('top', (size.y - elSize.y*ratio)/2 + 'px');
				el.setStyle('left', (size.x - elSize.x*ratio)/2 + 'px');
			}
			
		}
	},
	
	_adjustElement: function(el) {
		if (!el.retrieve('FlexSlide:ElementStyle')) {
			el.setStyle('display', 'block');
			el.store('FlexSlide:ElementStyle', el.get('style'));
		}
		el.set('style', el.retrieve('FlexSlide:ElementStyle') );
		
		var parent = el.getParent(), parentSize = parent.getSize(), elSize = el.getSize();
		
		var width = parentSize.x - el.getStyle('padding-left').toInt() - el.getStyle('padding-right').toInt() - parent.getStyle('padding-left').toInt() - parent.getStyle('padding-right').toInt();
		var height = parentSize.y - el.getStyle('padding-top').toInt() - el.getStyle('padding-bottom').toInt() - parent.getStyle('padding-top').toInt() - parent.getStyle('padding-bottom').toInt();
		var diffHeight = parentSize.y - elSize.y, diffWidth = parentSize.x - elSize.x;
		var autoItemSize = this.options.autoItemSize;
		
		if( this.options.autoItemSizeSpecial.contains(el.get('tag')) ) {
			autoItemSize.x = false;
			autoItemSize.y = false;
			if ( diffHeight > diffWidth ) //quer
				autoItemSize.x = true;
			else
				autoItemSize.y = true;
		}

		if( this.options.autoContainerSize.y && this.options.autoContainerSize.x ) {
			autoItemSize.x = false;
			autoItemSize.y = false;
		} else if ( this.options.autoContainerSize.y ) {
			autoItemSize.x = true;
			autoItemSize.y = false;
		} else if ( this.options.autoContainerSize.x ) {
			autoItemSize.x = false;
			autoItemSize.y = true;
		}
			
		var childs = el.getElements('*');
		if( autoItemSize.x ) {
			el.setStyle('width', width);
			if( childs.length === 1 && childs[0].get('tag') === 'img' )
				childs[0].setStyle('width', '100%');
		}
		if( autoItemSize.y ) {
			el.setStyle('height', height);
			if( childs.length === 1 && childs[0].get('tag') === 'img' )
				childs[0].setStyle('height', '100%');
		}
		
		elSize = el.getSize();
		if( this.options.centerItem === true && this.options.centerItemTags.contains(el.get('tag')) ) {
			if( diffHeight > diffWidth ) { //quer
				el.setStyle('margin', (height - elSize.y) / 2 + 'px 0' );
			} else {
				el.setStyle('margin', '0 ' + (width - elSize.x) / 2 + 'px' );
			}
		}

		if (autoItemSize.mode === 'crop' || autoItemSize.mode === 'cropBody') {
			scrollSize = parentSize;
			if (autoItemSize.mode === 'cropBody') {
				parent.setStyle('height', 'auto');
				parent.setStyle('width', 'auto');
				var scrollSize = $(document.body).getScrollSize();
				parent.setStyle('height', scrollSize.y);
				parent.setStyle('width', scrollSize.x);
			}
			
			var ratiox = scrollSize.x / elSize.x, ratioy = scrollSize.y / elSize.y;
			var ratio = ratioy > ratiox ? ratioy : ratiox;
			
			if (ratio == 'Infinity') {
				ratio = 1.1;
			}
			
			el.erase('height');
			el.erase('width');
			
			el.setStyle('height', elSize.y * ratio);
			el.setStyle('width', elSize.x * ratio);
			if (this.options.centerItem === true) {
				el.setStyle('margin', 0);
				el.setStyle('margin-top', (scrollSize.y - elSize.y*ratio)/2 + 'px');
				el.setStyle('margin-left', (scrollSize.x - elSize.x*ratio)/2 + 'px');
			}
		}
		
	},
	
	positionContainer: function(id) {
		this.wrapFxConfig[1] = this.wrapFxConfig[1] || {};

		var newPos = this.elements.item[id].position(this.options.positionContainerOptions);
		$extend(this.wrapFxConfig[1], newPos);
	},
	
	updateCounter: function(id) {
		if( this.counterWrap ) {
			this.counterWrap.set('html', this.options.counterTemplate.substitute({id: id+1, 'count': this.elements.item.length}) );
		}
	},
	
	process: function(id) {
		if( $chk(this.elements.select) ) {
			if( this.current >= 0 ) {
				this.elements.select[this.current].removeClass( this.options.ui.activeClass );
			}
			this.elements.select[id].addClass( this.options.ui.activeClass );
			
			if (this.options.useScroller === true && this.options.scrollToSelected) {
				this.scroll.toElement(this.elements.select[id]);
			}
			this.fireEvent('onSelectChange', [this.elements.select[this.current], this.elements.select[id]]);
		}
		
		this.updateCounter(id);

		if (this.options.mode === 'once') {
			if (id === 0) {
				if (this.current === 0) {
					if (this.previousWrap) this.previousWrap.fade('hide');
				} else {
					if (this.previousWrap) this.previousWrap.fade(0);
				}
				if (this.nextWrap) this.nextWrap.fade(1);
			}	else if(id === this.elements.item.length-1) {
				if (this.previousWrap) this.previousWrap.fade(1);
				if (this.nextWrap) this.nextWrap.fade(0);
			} else {
				if (this.previousWrap) this.previousWrap.fade(1);
				if (this.nextWrap) this.nextWrap.fade(1);
			}
		}

		this.fireEvent('process', [id, this.current]);
			
		this.current = id;
		//console.log('set cur', id);
		if (this.options.auto) this.auto();
	},
	
	// fixSizes: function() {
		// var scale = this.options.resizeLimit;
		// if (!scale) {
			// scale = this.container.getSize();
			// scale.x *= this.options.resizeFactor;
			// scale.y *= this.options.resizeFactor;
		// }
		// for (var i = 2; i--;) {
			// if (to.x > scale.x) {
				// to.y *= scale.x / to.x;
				// to.x = scale.x;
			// } else if (to.y > scale.y) {
				// to.x *= scale.y / to.y;
				// to.y = scale.y;
			// }
		// }
		// return this.zoomTo({x: to.x.toInt(), y: to.y.toInt()});
	// }
	
	toElement: function() {
		return this.wrap;
	}
	
});