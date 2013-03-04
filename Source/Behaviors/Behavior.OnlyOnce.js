/*
---
name: Behavior.OnlyOnce
description: Adds a Cookie check to a link, if true the link will be converted to a span and will be not clickable anymore.
provides: [Behavior.OnlyOnce]
requires: [Behavior/Behavior, Core/Cookie]
script: Behavior.OnlyOnce.js

...
*/

/**
 * Allows a link to be only clicked once. Once clicked it will be converted to a span. It sets a Cookie to check, so it
 * is by no means a save method. If you clear your cookies you can click the link again.
 *
 * = Examples =
 * <code title="Default">
 *   <a href="http://www.google.com" class="red" data-behavior="OnlyOnce" data-onlyonce-uid="myUid12">google</a>
 * </code>
 * <output>
 *   // of has not been clicked so far
 *   <a href="http://www.google.com" class="red" data-behavior="OnlyOnce" data-onlyonce-uid="myUid12">google</a>
 *   // if has been clicked
 *   <span class="red">google</span>
 * </output>
 *
 * <code title="Options">
 *   uid: String, how to identify the link
 *   uidprefix: String (defaults to 'OnlyOnce::') if needed use a custom prefix for the uid (for example if uid is just a number)
 *   cookiedomain: String (defaults to 'auto) provide the domain the cookie should be valid for, if set to 'auto' it will use the current domain
 *   cookieduration: Number (defaults to 365) how many days should the cookie be valid
 * </code>
 *
 */

(function(){

Behavior.addGlobalFilter('OnlyOnce', {

	required: ['uid'],

	defaults: {
		uidprefix: 'OnlyOnce::',
		cookiedomain: 'auto',
		cookieduration: 365
	},

	setup: function(element, api) {
		var cookieOptions = {};
		cookieOptions.domain = api.getAs(String, 'domain');
		if (cookieOptions.domain === 'auto') {
			cookieOptions.domain = document.location.hostname;
		}
		cookieOptions.duration = api.getAs(Number, 'cookieduration');
		var uid = api.getAs(String, 'uidprefix') + api.getAs(String, 'uid');

		if (Cookie.read(uid) === '1') {
			var span = new Element('span', {
				'class': element.get('class'),
				'id': element.get('id'),
				'style': element.get('style'),
				'html': element.get('html')
			});
			span.replaces(element);

		} else {
			element.addEvent('click', function() {
				Cookie.write(uid, '1', cookieOptions);
			});
		}
	}

});

})();