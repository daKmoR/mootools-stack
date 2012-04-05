/*
---
name: PageZoom
description: creates a semi-transparent layer that fades in/out
license: MIT-style license.
requires: [Core/Element, Core/Browser]
provides: PageZoom

...
*/ 

var Page = {
	
	setZoom: function(to, showErrors) {
		var body = document.id(document.body), old = this.getZoom();
		var showErrors = showErrors === false ? false : true;
		
		if (Browser.ie) {
			if (Browser.version <= 7) {
				if (showErrors === true) {
					alert('This feature is not supported by your current version of this browser. We encourage you to upgrade.');
				}
				return false; // not supported
			}
			
			var oldWidth = body.getSize().x;
			if (Browser.version > 8) {
				oldWidth = oldWidth*(2.02-to);
			}
			if (Browser.version === 8) {
				oldWidth = to > 1 ? oldWidth*(1.9-to) : oldWidth*(2.4-to);
			}
			if (to !== 1) {
				body.set('style', 'zoom: ' + to + '; width: ' + oldWidth + 'px;');
			} else {
				body.setStyle('zoom', 1);
				body.setStyle('width', 'auto');
			}
			Cookie.write('Behavior::Zoom', to);
		} else if (Browser.firefox) {
			body.setStyle('-moz-transform', 'scale(' + '1' + ')');
			body.setStyle('margin-top', 0);
			var normalHeight = body.getScrollSize().y;
			if (to < 1) {
				var tmpTo = 2-to;
				body.setStyle('-moz-transform', 'scale(' + tmpTo + ')');
				var marginTop = body.getScrollSize().y - normalHeight;
				body.setStyle('-moz-transform', 'scale(' + to + ')');
				body.setStyle('margin-top', -marginTop+5);
			} else {
				body.setStyle('-moz-transform', 'scale(' + to + ')');
				body.setStyle('margin-top', body.getScrollSize().y - normalHeight);
			}
			Cookie.write('Behavior::Zoom', to);
		}	else {
			body.set('style', 'zoom: ' + to);
			Cookie.write('Behavior::Zoom', to);
		}
		document.id(document.body).fireEvent('zoomed', to.toFloat());
		if (to !== old) {
			document.id(document.body).fireEvent('zoomChanged', [to, old]);
		}
	},
	
	zoom: function(to) {
		this.setZoom(to);
	},
	
	getZoom: function() {
		var zoom = Cookie.read('Behavior::Zoom');
		return zoom ? zoom.toFloat() : 1;
	},
	
	applySavedZoom: function() {
		this.setZoom(this.getZoom(), false);
	}

};