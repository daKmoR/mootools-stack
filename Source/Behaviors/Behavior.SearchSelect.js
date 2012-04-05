/*
---
name: Behavior.SearchSelect
description: Adds a SearchSelect interface
provides: [Behavior.SearchSelect]
requires: [Behavior/Behavior, Select]
script: Behavior.SearchSelect.js

...
*/

Behavior.addGlobalFilter('SearchSelect', {

	setup: function(element, api) {
		
		var mySearchSelect = new Select(element, {
			multiple: {	
				statusElementsTruncate: { 
					length: api.getAs(Number, 'status-elements-truncate-length')
				}
			},
			single: {
				statusElementsTruncate: { 
					length: api.getAs(Number, 'status-elements-truncate-length')
				}
			}
		});
		
	}

});