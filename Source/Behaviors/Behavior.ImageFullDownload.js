/*
---
name: Behavior.ImageFullDownload
description: Adds a ImageFullDownload
provides: [Behavior.ImageFullDownload]
requires: [Behavior/Behavior, Behavior/Element.Data, More/Object.Extras, Core/Selectors, Core/Fx.Tween]
script: Behavior.ImageFullDownload.js

...
*/

Behavior.addGlobalFilter('ImageFullDownload', {

	setup: function(element, api) {
		var parentLink = element.getParent();
		if (parentLink.get('tag') === 'a') {
			parentLink.setStyle('line-height', 0);
		}
		
		var url = api.getAs(String, 'fulldownload') || parentLink.get('url');
		if (url === '') {
			//error
			return
		}
		var root = new Element('span[style="position: relative; display: block;"]').wraps(element);
		var link = new Element('a.download').fade('hide');
		link.set('href', 'download/' + url.split('/')[2]);
		link.set('href', url);
		
		link.addEvent('click', function(e) {
			e.stop();
			window.location.href = this.get('href');
		});
		root.grab(link);
		
		root.addEvents({
			'mouseenter': function() { if (link = this.getParent().getElement('a.download')) link.fade(1); },
			'mouseleave': function() { if (link = this.getParent().getElement('a.download')) link.fade(0); }
		});
	}

});