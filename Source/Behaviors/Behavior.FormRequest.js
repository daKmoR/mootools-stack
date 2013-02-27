/*
---
description: Makes form elements with a FormRequest data filter automatically update via Ajax.
provides: [Behavior.FormRequest]
requires: [Behavior/Behavior, More/Form.Request, Behavior/Element.Data]
script: Behavior.FormRequest.js
name: Behavior.FormRequest
...
*/

Request = Class.refactor(Request, {

	getSpinner: function(){
		if (!this.spinner){
			var update = document.id(this.options.spinnerTarget) || document.id(this.options.update);
			if (this.options.useSpinner && update){
				update.set('spinner', this.options.spinnerOptions);
				var spinner = this.spinner = update.get('spinner');
				['complete', 'exception'].each(function(event){
					this.addEvent(event, spinner.hide.bind(spinner));
				}, this);
				this.addEvent('cancel', function() {
					if (this.options.link === 'cancel') {
						// if link is cancel the request might just be canceled to start another one
						(function() {
							if (!this.running) {
								spinner.hide.bind(spinner);
							}
						}).delay(50, this);
					} else {
						spinner.hide.bind(spinner);
					}
				}.bind(this));
			}
		}
		return this.spinner;
	}

});

Behavior.addGlobalFilter('FormRequest', {
	defaults: {
		resetForm: true,
		link: 'ignore'
	},
	setup: function(element, api){
		var updateElement,
		    update = api.get('update'),
		    spinner = api.get('spinner');
		if (update =="self") updateElement = element;
		else updateElement = element.getElement(update);

		if (spinner == "self") spinner = element;
		else if (spinner) spinner = element.getElement(spinner);
		else spinner = updateElement;

		if (!updateElement) api.fail('Could not find target element for form update');
		var sentAt;
		var req = new Form.Request(element, updateElement, {
			requestOptions: {
				filter: api.get('filter'),
				spinnerTarget: spinner,
				link: api.get('link')
			},
			resetForm: api.get('resetForm')
		}).addEvent('complete', function(){
			api.applyFilters(updateElement);
		}).addEvent('send', function(){
			sentAt = new Date().getTime();
		});
		// this bit below is to throttle form submission in case more than one thing
		// is trying to send it

		// remove form.request submit watcher
		element.removeEvent('submit', req.onSubmit);
		// our new submit handler checks that requests to submit are at least 200ms apart
		var submit = function(e){
			if (!sentAt || sentAt + 200 < new Date().getTime()) {
				req.onSubmit(e);
			} else {
				// if they aren't, just stop the submit event if it's present
				if (e) e.stop();
			}
		};
		// now monitor submit with our new method
		element.addEvent('submit', submit);
		// and overwrite the submit method on the element
		element.submit = submit;
		api.onCleanup(function(){
			req.detach();
			delete element.submit;
		});
		return req;
	}

});