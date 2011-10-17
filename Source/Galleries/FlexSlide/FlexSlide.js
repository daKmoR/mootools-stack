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
	
	Extends: Gallery,
	
	options: {
		selections: {}, /* item: '.myOtherItemClass' you can define your own css classes here */
		render: ['item'], // special elements are: ['item', 'select', 'advSelect', 'description', 'counter', 'next', 'previous',  'selectScroller', 'start', 'stop', 'toggle']
		ui: {
			wrap: { 'class': 'ui-Wrap' },
			selectItem: { 'class': 'ui-SelectItem' },
			descriptionItem: { 'class': 'ui-DescriptionItem' },
			itemItem: { 'class': 'ui-ItemItem' }
		},
		show: 0,
		buildOnInit: true,
		initFx: 'display',
		size: 'element', // [{width: 500, height: 500}, 'none', 'element', 'element[x]', 'wrap', 'auto', {width: 300, height: 'auto'}] element uses the show element
		itemSize: 'scale', // ['none', 'scale', 'crop', 'same']
		itemSizeOverride: {
			div: 'same'
		},
		itemPosition: { position: 'center' },
		itemPositionOverride: {
			div: { position: 'leftTop' }
		},
		container: null,
		containerPosition: null, //{ position: 'center' }
		mode: 'repeat', //['repeat', 'once']
		resetIframeOnChange: true,
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
			globalOptions: { duration: 800, transition: Fx.Transitions.linear },
			options: { display: { duration: 0 }	},
			wrapFxOptions: { duration: 800, transition: Fx.Transitions.Quart.easeInOut }
		},
		effects: {
			fadeInPrepare:  function(id, el) { el.setStyle('opacity', 0); },
			fadeIn:         function(id, el) { this.fxConfig[id] = { 'opacity': 1 }; },
			fadeOutPrepare: function(id, el) { el.setStyle('opacity', 1); },
			fadeOut:        function(id, el) { this.fxConfig[id] = { 'opacity': 0 }; },
			displayIn:  function(id, el) { el.setStyle('display', 'block'); },
			displayOut: function(id, el) { el.setStyle('display', 'none'); }
		},
		onShowIn: function(id, el) {
			if (this.elements.description && this.elements.description[id]) {
				this.elements.description[id].fade('hide').setStyle('display', 'block').fade(1);
			}
		},
		onShowOut: function(id, el) {
			if (this.elements.description && this.elements.description[id]) {
				this.elements.description[id].fade('show').setStyle('display', 'block').fade(0);
			}
		}
		/*onShow, onBuild, onSelectChange(currentEl, nextEl) */
	},
	
	current: -1,
	running: false,
	size: {},
	elements: {},
	fxConfig: {},
	wrapFxConfig: {},
	
	initialize: function(wrap, options) {
		if (!(this.wrap = $(wrap))) return;
		this.parent(options);
		
		if (this.options.container == undefined) {
			this.options.container = this.wrap.getParent();
		}
		
		if (this.options.buildOnInit === true) {
			this.build();
		}
		
		if (this.options.show === 'random') {
			this.options.show = Number.random(0, this.elements.item.length-1);
		}
	},
	
	// starting with dynamic attaching of Elements; not finished; usage this.attach(document.id('addMe'));
	attach: function(el) {
		var el = el.clone();
		el.addClass(this.options.ui['itemItem']['class']);
		this['itemWrap'].grab(el);
		var newId = this.elements.item.push(el) - 1;
		this.fx.elements = this.fx.subject = this.elements.item;
		this.updateCounter(this.current);
		
		// select stuff
		if (this.selectWrap) {
			var select = new Element('div', this.options.ui.selectItem)
				.addEvent('click', this.show.bind(this, newId))
				.inject(this.selectWrap);
				
			var text = el.get('alt') || el.get('title') || '';
			select.set('html', this.options.selectTemplate.substitute({id: newId+1, text: text}));
			this.elements.select.push(select);
		}
		
		// description
		if (this.descriptionWrap) {
			var description = new Element('div', this.options.ui.descriptionItem)
				.inject(this.descriptionWrap);
			
			var txt = el.get('title') || el.get('alt') || false;
			if (!txt && el.getElement('img')) {
				txt = el.getElement('img').get('alt');
			}
			
			if (txt && txt != null) {
				var parts = txt.split('::');
				if (parts.length === 2) {
					txt = this.options.descriptionTemplate.substitute( {'title': parts[0], 'text': parts[1]} );
				}
				if (txt.charAt(0) === '#') {
					txt = $$(txt)[0].get('html');
				}
				description.set('html', txt);
			}
			
			this.elements.description.push(description);
		}
	},
	
	buildFinished: function() {
		if (this.options.useScroller == true) {
			if (this.options.scrollerMode === 'horizontal') {
				this.selectWrap.setStyle('width', this.selectWrap.getChildren().getCombinedSize().x);
			}
			if (this.options.scrollerMode === 'vertical') {
				this.selectWrap.setStyle('height', this.selectWrap.getChildren().getCombinedSize().y);
			}
			this.scroller = new Scroller(this.selectWrap.getParent(), this.options.scrollerOptions).start();
			this.scroll = new Fx.Scroll(this.selectScrollerWrap, this.options.scrollOptions);
		}
		
		if (this.options.buildOnInit === true && this.options.show >= 0 && this.options.show < this.elements.item.length) {
			this.show(this.options.show, this.options.initFx); 
		}
	
		this.fireEvent('onBuild');
	},
	
	guessSize: function() {
		if (typeOf(this.options.size) === 'object' && (typeOf(this.options.size.width) === 'number' || typeOf(this.options.size.height) === 'number')) {
			if (typeOf(this.options.size.width) === 'number') {
				this.size.width = this.options.size.width;
			}
			if (typeOf(this.options.size.height) === 'number') {
				this.size.height = this.options.size.height;
			}
			this.itemWrap.setStyles(this.size);
		}
	
		if (typeOf(this.options.size) === 'string' || (typeOf(this.options.size) === 'object' && (this.options.size.width === 'auto' || this.options.size.height === 'auto'))) {
			if (this.options.size !== 'none') {
			
				// element
				if (this.options.size === 'element' || this.options.size.width === 'auto' || this.options.size.height === 'auto') {
					var elementX = this.options.show;
				}
				if (typeOf(this.options.size) === 'string' && this.options.size.indexOf('element[') >= 0) {
					elementX = this.options.size.substr(8).toInt();
				}
				
				// element[x]
				if (elementX >= 0 && elementX < this.elements.item.length) {
					var el = this.elements.item[elementX];
					if (el.get('tag') === 'img') {
						var img = Asset.image(el.get('src'), {
							onLoad: function() {
								var tmpSize = {
									width: el.getStyle('width').toInt() === 'number' ? el.getStyle('width').toInt() : img.get('width').toInt(),
									height: el.getStyle('height').toInt() === 'number' ? el.getStyle('height').toInt() : img.get('height').toInt()
								}
								this.size = {
									width: (this.options.size.width === 'auto') ? tmpSize.width : this.size.width,
									height: (this.options.size.height === 'auto') ? tmpSize.height : this.size.height
								}
								this.itemWrap.setStyles(this.size);
								this.buildFinished();
							}.bind(this)
						});
					} else {
						var childs = el.getElements('> *');
						if (childs.length === 1 && childs[0].get('tag') === 'img') {
							var subImg = Asset.image(childs[0].get('src'), {
								onLoad: function() {
									subImg.set(childs[0].get('style', 'class'));
									var tmpSize = {
										width: childs[0].getStyle('width').toInt() === 'number' ? childs[0].getStyle('width').toInt() : subImg.get('width').toInt(),
										height: childs[0].getStyle('height').toInt() === 'number' ? childs[0].getStyle('height').toInt() : subImg.get('height').toInt()
									}
									this.size = {
										width: (this.options.size.width === 'auto') ? tmpSize.width : this.size.width,
										height: (this.options.size.height === 'auto') ? tmpSize.height : this.size.height
									}
									this.itemWrap.setStyles(this.size);
									this.buildFinished();
								}.bind(this)
							});
						} else {
							el.inject(this.itemWrap);
							el.setStyle('display', 'block'); //IE7 needs this
							var tmpSize = el.getDimensions();
							this.size = {
								width: (this.options.size.width === 'auto') ? tmpSize.width : this.size.width,
								height: (this.options.size.height === 'auto') ? tmpSize.height : this.size.height
							}
							this.itemWrap.setStyles(this.size);
							el.dispose();
							this.buildFinished();
						}
					}
				} else {
					this.buildFinished();
				}
				
				// container
				if (this.options.size === 'wrap') {
					this.size = this.wrap.getDimensions();
					this.itemWrap.setStyles(this.size);
					this.buildFinished();
				}
				
			}
			
		} else {
			this.buildFinished();
		}
	},
	
	build: function() {
		this.builder(this.options.render, this.wrap);
		
		//automatically build the select if no costum select items are found
		if (this.elements.select && this.elements.select.length <= 0) {
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
		if (this.elements.description && this.elements.description.length <= 0) {
			this.elements.item.each( function(el, i) {
				var description = new Element('div', this.options.ui.descriptionItem)
					.inject(this.descriptionWrap);
				
				var txt = el.get('title') || el.get('alt') || false;
				if (!txt && el.getElement('img')) {
					txt = el.getElement('img').get('alt');
				}
				
				if (txt && txt != null) {
					var parts = txt.split('::');
					if (parts.length === 2) {
						txt = this.options.descriptionTemplate.substitute( {'title': parts[0], 'text': parts[1]} );
					}
					if (txt.charAt(0) === '#') {
						txt = $$(txt)[0].get('html');
					}
					description.set('html', txt);
				}
				
				this.elements.description.push(description);
			}, this);
			
		}
		
		this.fx = new Fx.Elements(this.elements.item);
		this.wrapFx = new Fx.Elements([this.itemWrap, this.wrap]);
		
		this.updateCounter(0);
		this.wrap.addClass(this.options.ui.wrap['class']);
		
		if (this.nextWrap)     { this.nextWrap.addEvent(    'click', this.next.bind(this, this.options.times)); }
		if (this.previousWrap) { this.previousWrap.addEvent('click', this.previous.bind(this, this.options.times)); }
		if (this.startWrap)    { this.startWrap.addEvent(   'click', this.start.bind(this) );	}
		if (this.stopWrap)     { this.stopWrap.addEvent(    'click', this.stop.bind(this)  ); }
		if (this.toggleWrap)   { this.toggleWrap.addEvent(  'click', this.toggle.bind(this));	}
		
		this.guessSize();
	},
	
	buildElement: function(item, wrapper) {
		if (!this.options.ui[item]) {
			this.options.ui[item] = { 'class': 'ui-' + item.capitalize() };
		}
		if (!this.options.selections[item]) {
			this.options.selections[item] = '.' + item;
		}
		this.elements[item] = wrapper.getElements(this.options.selections[item]);
		this[item + 'Wrap'] = new Element('div', this.options.ui[item]).inject(wrapper);
		
		if (this.elements[item].length > 0) {
			this.elements[item].each(function(el, i) {
				if (item === 'select') {
					el.addEvent('click', this.show.bind(this, i));
					if (el.get('tag') !== 'img') {
						el.set('html', this.options.selectTemplate.substitute({id: i+1, text: el.get('html')}));
					}
				}
				if (!this.options.ui[item + 'Item']) {
					this.options.ui[item + 'Item'] = { 'class': 'ui-' + item.capitalize() + 'Item' };
				}
				el.addClass(this.options.ui[item + 'Item']['class']);
				this[item + 'Wrap'].grab(el);
				//this.elements[item][i] = el.dispose();
			}, this);
		}
	},
	
	builder: function(els, wrapper) {
		els.each(function(item, i) {
			if (item === 'advSelect') {
				els[i] = item = {'selectScroller' : ['select']};
				this.options.useScroller = true;
			}
			if (typeOf(item) !== 'object') {
				this.buildElement(item, wrapper);
			} else {
				Object.each(item, function(el, i) {
					this.buildElement(i, wrapper);
					this.builder(el, this[i + 'Wrap']);
				}, this);
			}
		}, this);
	},
	
	_in: function(id, fxGroup) {
		if (id != this.current && id < this.elements.item.length && this.running === false) {
			this.prepareElement(id, fxGroup);
		}
	},
	
	__in: function(id, fxGroup) {
		var fx = fxGroup + 'In';
		if (this.options.effects[fx + 'Prepare']) {
			this.options.effects[fx + 'Prepare'].call(this, id, this.elements.item[id]);
		}
		this.options.effects[fx].call(this, id, this.elements.item[id]);
		
		this.doFx(id, fxGroup);
		this.fireEvent('showIn', [id, this.elements.item[id]]);
	},
	
	out: function(fxGroup, doFx, id) {
		var id = id || this.current;
		var doFx = (doFx != undefined) ? doFx : true;
		
		if (id >= 0 && id < this.elements.item.length) {
			var fx = fxGroup + 'Out';
			this.prepareCurrent(id, fx);
			if (this.options.effects[fx + 'Prepare']) {
				this.options.effects[fx + 'Prepare'].call(this, id, this.elements.item[id]);
			}
			this.options.effects[fx].call(this, id, this.elements.item[id]);
			if (doFx) {
				this.doFx(id, fxGroup);
			}
			this.fireEvent('showOut', [id, this.elements.item[id]]);
		}
	},
	
	show: function(id, fxGroup) {
		var fxGroup = fxGroup || (id > this.current ? this.options.effect.up : this.options.effect.down);
		fxGroup = fxGroup === 'random' ? fxGroup = this.options.effect.random.getRandom() : fxGroup;
	
		if (id != this.current && id < this.elements.item.length && this.running === false) {
			this.fxConfig = {};
			this.out(fxGroup, false);
			this._in(id, fxGroup);
			this.fireEvent('show', [this.current, id]);
		}
	},
	
	doFx: function(id, fxGroup) {
		var newOptions = Object.merge(Object.clone(this.options.effect.globalOptions), this.options.effect.options[fxGroup]);
		this.fx.setOptions(newOptions);
		this.wrapFx.setOptions(this.options.effect.wrapFxOptions);
	
		this.running = true;
		var oldcurrent = this.current;
		this.fx.elements = this.fx.subject = this.elements.item;
		
		this.fx.start(this.fxConfig).chain(function() {
			this.running = false;
			this.showEnd(oldcurrent);
		}.bind(this));
		
		if (this.elements.item[this.current]) {
			this.elements.item[this.current].setStyle('display', 'block');
		}
		this.elements.item[id].setStyle('display', 'block');
		
		this.wrapFx.start(this.wrapFxConfig);
		this.process(id);
	},
	
	showEnd: function(oldcurrent) {
		// "reset" iframe src to stop started flash videos
		if (this.elements.item[oldcurrent] && this.elements.item[oldcurrent].get('tag') === 'iframe' && this.options.resetIframeOnChange) {
			this.elements.item[oldcurrent].set('src', this.elements.item[oldcurrent].get('src'));
		}
		//this.elements.item[oldcurrent] = this.elements.item[oldcurrent].dispose();
		this.fireEvent('showEnd');
	},

	
	prepareCurrent: function(el) {
		var  i = typeOf(el) === 'number' ? el : this.elements.item.indexOf(el);
		var el = this.elements.item[i];
		
		var keepStyles = el.getStyles('width', 'height', 'padding');
		el.set('style', 'display: block;');
		el.setStyles(keepStyles);
		//this.elements.item[i] = el;
		//this.adjustElement(el);
	},
	
	prepareElement: function(el, fx) {
		var  i = typeOf(el) === 'number' ? el : this.elements.item.indexOf(el);
		var el = this.elements.item[i];
		
		el.set('style', el.retrieve('FlexSlide::Style', el.get('style')));
		if (el.get('tag') === 'img') {
			var img = Asset.image(el.get('src'), {
				onLoad: function() {
					img.set(el.get('style', 'class'));
					img.store('FlexSlide::Style', el.retrieve('FlexSlide::Style'));
					el.dispose();
					img.inject(this.itemWrap);
					this.elements.item[i] = img;
					this.adjustElement(img);
					this.__in(i, fx);
				}.bind(this)
			});
		} else {
			var childs = el.getElements('> *');
			if (childs.length === 1 && childs[0].get('tag') === 'img') {
				var subImg = Asset.image(childs[0].get('src'), {
					onLoad: function() {
						subImg.set(childs[0].get('style', 'class'));
						el.setStyles({
							width: childs[0].getStyle('width').toInt() === 'number' ? childs[0].getStyle('width').toInt() : subImg.get('width').toInt(),
							height: childs[0].getStyle('height').toInt() === 'number' ? childs[0].getStyle('height').toInt() : subImg.get('height').toInt()
						});
						childs[0].dispose();
						subImg.erase('width').erase('height');
						el.inject(this.itemWrap);
						subImg.inject(el);
						this.elements.item[i] = el;
						this.adjustElement(el);
						this.__in(i, fx);
					}.bind(this)
				});
			} else {
				el.inject(this.itemWrap);
				this.elements.item[i] = el;
				this.adjustElement(el);
				this.__in(i, fx);
			}
		}
		
	},
	
	adjustElement: function(el) {
		var el = typeOf(el) !== 'element' ? this.elements.item[el] : el;
		var elSize = el.getDimensions();
		
		if (useWidth = el.getElement('.useWidth')) {
			elSize.width = useWidth.getStyle('width').toInt() || useWidth.getDimensions().width;
			el.setStyles({'width': elSize.width, 'height': 'auto'});
			elSize = el.getDimensions();
			this.size = elSize;
		}
		
		if (this.options.size.height === 'auto' || this.options.size.width === 'auto') {
			this.wrapFxConfig[0] = {}
		}
		if (this.options.size.height === 'auto') {
			this.wrapFxConfig[0].height = elSize.height;
		}
		if (this.options.size.width === 'auto') {
			this.wrapFxConfig[0].width = elSize.width;
		}
		
		var itemSize = this.options.itemSizeOverride[el.get('tag')] || this.options.itemSize;
		if (itemSize === 'none') {
			return;
		} else if (itemSize === 'same') {
			el.erase('width').erase('height');
			if (this.options.size.height === 'auto') {
				this.size.height = elSize.height;
			}
			el.setStyles(this.size);
		} else {
		
			var itemPosition = Object.clone(this.options.itemPosition);
			if (itemPositionOverride = this.options.itemPositionOverride[el.get('tag')]) {
				Object.merge(itemPosition, itemPositionOverride);
			}
			
			var size = this.itemWrap.getComputedSize();
			size.height = this.options.size.height === 'auto' ? elSize.height : size.height;
			size.width  = this.options.size.width  === 'auto' ? elSize.width  : size.width;
			
			// if (itemSize === 'cropScroll' || itemSize === 'scaleScroll') {
				// //var scrollSize = $(document.body).getScrollSize();
				// size = this.itemWrap.getScrollSize();
			// }
			var ratiox = size.width / elSize.x, ratioy = size.height / elSize.y;
			
			if (itemSize === 'scale') {
				var ratio = ratioy < ratiox ? ratioy : ratiox;
			} else if (itemSize === 'crop') {
				var ratio = ratioy > ratiox ? ratioy : ratiox;
			}
			
			el.erase('width').erase('height');
			el.setStyle('width', elSize.x * ratio).setStyle('height', elSize.y * ratio);
			
			if (itemSize === 'scale') {
				// for relative position calculation we need the "future" size, just for a short second
				var savedStyle = this.itemWrap.get('style');
				this.itemWrap.setStyles({'height': size.height, 'width': size.width});
				var returnPos = el.calculatePosition(Object.merge({relativeTo: this.itemWrap, offset: {x: size.computedLeft*-1, y: size.computedTop*-1}}, itemPosition));
				this.itemWrap.set('style', savedStyle);
				if (returnPos.left !== 0) {
					el.setStyle('padding-left', returnPos.left).setStyle('padding-right', returnPos.left);
				}
				if (returnPos.top !== 0) {
					el.setStyle('padding-top', returnPos.top).setStyle('padding-bottom', returnPos.top);
				}
			} else if (itemSize === 'crop' && itemPosition.position === 'center') {
				el.setStyle('top', (size.height - elSize.y*ratio)/2 + 'px');
				el.setStyle('left', (size.width - elSize.x*ratio)/2 + 'px');
			}
			
		}
		
		elSize = el.getDimensions();
		if (this.options.containerPosition) {
			var savedStyle = this.wrap.get('style');
			this.wrap.set('style', '');
			this.wrap.setStyles(elSize);
			this.wrapFxConfig[1] = this.wrap.calculatePosition(this.options.containerPosition);
			this.wrap.set('style', savedStyle);
		}
	},
	
	updateCounter: function(id) {
		if (this.counterWrap) {
			this.counterWrap.set('html', this.options.counterTemplate.substitute({id: id+1, 'count': this.elements.item.length}) );
		}
	},
	
	process: function(id) {
		if (this.elements.select) {
			if (this.current >= 0) {
				this.elements.select[this.current].removeClass(this.options.ui.activeClass);
			}
			this.elements.select[id].addClass(this.options.ui.activeClass);
			
			if (this.options.useScroller === true && this.options.scrollToSelected) {
				this.scroll.toElement(this.elements.select[id]);
			}
			this.fireEvent('onSelectChange', [this.elements.select[this.current], this.elements.select[id]]);
		}
		
		this.updateCounter(id);
		this.parent(id);
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