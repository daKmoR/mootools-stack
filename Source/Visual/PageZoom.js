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
	
	zoom: function(to) {
		var body = document.id(document.body);
		
		if (Browser.ie) {
			var oldWidth = body.getSize().x;
			oldWidth = oldWidth*(2-to);
			body.set('style', 'zoom: ' + to + '; width: ' + oldWidth + 'px;');
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
		}	else {
			body.set('style', 'zoom: ' + to);
		}
	}

};