/*
---

name: FlexSlide.Advanced

description: allows to create almost any Sliding Stuff (Galleries, Tabs...) with multiple effects

license: MIT-style license.

requires: [Core/Request.HTML, More/Assets, More/URI, FlexSlide]

provides: FlexSlide.Advanced

...
*/

FlexSlide.Advanced = new Class({

	Extends: FlexSlide,
	
	options: {
		ui: {
			requestItem: { 'class': 'ui-RequestItem' },
			inlineItem: { 'class': 'ui-InlineItem' },
			iframeItem: { 'class': 'ui-IframeItem' },
			loader: { 'class': 'ui-Loader ui-ItemItem' }
		},
		container: null,
		loaderOpacity: 0.5,
		dynamicLoading: true,
		dynamicMode: '',  //image, request, inline
		preLoading: { previous: 1, next: 2 },
		active: true,
		wheelListener: false,
		keyboardListener: false
	},
	
	loaded: {},
	loading: {},
	
	build: function() {
		if (this.options.dynamicLoading === true) {
			this.loader = new Element('div', this.options.ui.loader).fade('hide');
			this.loader.set('tween', { duration: 100 });
		}
		
		this.parent();
		
		if (this.options.wheelListener) {
			document.addEvent('mousewheel', this.wheelListener.bindWithEvent(this));
		}
		if (this.options.keyboardListener) {
			document.addEvent('keydown', this.keyboardListener.bindWithEvent(this));		
		}
	},
	
	_in: function(id, fxGroup) {
		if (this.options.dynamicLoading === true && this.elements.item[id].get('tag') === 'a') {
			this.dynamicLoading(id, fxGroup);
		} else {
			this.prepareElement(id, fxGroup);
		}
		if (this.options.dynamicLoading === true) {
			this.preLoading(id);
		}
	},
	
	preLoading: function(current) {
		if( this.options.dynamicLoading === true && (this.options.preLoading.next > 0 || this.options.preLoading.previous > 0) ) {
			for( i = this.options.preLoading.previous*-1; i <= this.options.preLoading.next; i++ ) {
				if( i != 0 ) {
					this.preLoad( this.getNextId(i, current) );
				}
			}
		}
	},
	
	preLoad: function(id) {
		if (this.loading[id] != true) {
			this.dynamicLoading(id, null, false);
		}
	},
	
	dynamicLoading: function(id, fx, show) {
		var show = show;
		if( show == null ) 
			show = true;
		
		if( show && this.loaded[id] ) {
			this.show(id, fx);
			return true;
		}
		if( this.elements.item[id] && this.elements.item[id].get('tag') === 'a' && this.options.dynamicLoading === true ) {
			var href = this.elements.item[id].get('href');

			this.loading[id] = true;
			var mode = this.options.dynamicMode || this.guessDynamicMode(href);
			
			this.elements.item[id].destroy();
			
			if( show ) {
				this.itemWrap.grab( this.loader );
				this.loader.fade( this.options.loaderOpacity );
			}
			
			switch( mode ) {
				case 'image':
					var imageLoader = new Asset.image(href, {
						onLoad: function(image) {
							this.loader.fade(0);
							image.addClass( this.options.ui.itemItem['class'] );
							this.elements.item[id] = this.fx.elements[id] = image;
							this.itemWrap.grab( image );
							this.loaded[id] = true;
							this.fireEvent('imageLoaded', image);
							if (show) this.prepareElement(id, fx);
						}.bind(this)
					});
					break;
				case 'request':
					var request = new Request.HTML({ method: 'get', autoCancel: true, url: href,
						onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript) {
							this.loader.fade(0);
							var div = new Element('div', {'class': this.options.ui.itemItem['class'] + ' ' + this.options.ui.requestItem['class']} );
							div.set('html', responseHTML);
							this.loaded[id] = true;
							this.elements.item[id] = this.fx.elements[id] = div;
							this.itemWrap.grab(div);
							this.fireEvent('loaded', div);
							if (show) this.prepareElement(id, fx);
						}.bind(this)
					}).send();
					break;
				case 'inline':
					this.loader.fade(0);
					var div = new Element('div', {'class': this.options.ui.itemItem['class'] + ' ' + this.options.ui.inlineItem['class']} );
					$$(href)[0].clone().setStyle('display', 'block').inject( div );
					this.elements.item[id] = this.fx.elements[id] = div;
					this.itemWrap.grab(div);
					if (show) this.prepareElement(id, fx);
					break;
				case 'youtube':
					var youtubeId = '';
					if (href.contains('youtube.com')) {
						youtubeId = href.substring(href.indexOf('v=')+2);
						youtubeId = youtubeId.contains('&') ? youtubeId.substring(0, youtubeId.indexOf('&')) : youtubeId;
					}
					if (href.contains('youtu.be')) {
						youtubeId = href.substr(href.lastIndexOf('/')+1);
					}
					href = (youtubeId.length > 0) ? 'http://www.youtube.com/embed/' + youtubeId + '?wmode=opaque' : href;
					// no break as the iframe code below will actually insert the video
				case 'iframe':
					var iframe = new Element('iframe', {
						'class': this.options.ui.itemItem['class'] + ' ' + this.options.ui.iframeItem['class'],
						'src': href,
						'frameborder': 0
					});
					this.elements.item[id] = this.fx.elements[id] = iframe;
					this.itemWrap.grab(iframe);
					if (show) this.show(id, fx);
					break;
			}
			
		}
	},
	
	keyboardListener: function(event){
		if (!this.options.active) return;
		//if(event.key != 'f5') event.preventDefault();
		switch (event.key) {
			case 'p': case 'left': this.previous(); break;	
			case 'n': case 'right': this.next(); break;
			case 'space': this.stop();
		}
	},

	wheelListener: function(event){
		if (!this.options.active) return;
		event.preventDefault();
		if (event.wheel > 0) this.previous();
		if (event.wheel < 0) this.next();
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
	
	guessDynamicMode: function(href) {
		var fileExt = href.substr(href.lastIndexOf('.') + 1).toLowerCase();
		
		switch( fileExt ) {
			case 'jpg':
			case 'gif':
			case 'png':
				return 'image';
			case 'swf':
				return 'flash';
			case 'flv':
				return 'flashVideo';
			case 'mov':
				return 'quicktime';
			case 'wmv':
				return 'windowsMedia';
			case 'rv':
			case 'rm':
			case 'rmvb':
				return 'real';
			case 'mp3':
				return 'flashMp3';
			default:
				if( href.charAt(0) === '#' ) {
					return 'inline';
				} else if( document.location.host === href.toURI().get('host') + (document.location.host.contains(':') ? ':' + href.toURI().get('port') : '') ) {
					return 'request';
				} else if (href.contains('youtube.com') || href.contains('youtu.be')) {
					return 'youtube';
				} else {
					return 'iframe';
				}
		}
	}
	
});