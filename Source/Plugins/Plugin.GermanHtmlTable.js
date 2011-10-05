/*
---
description: a Plugin for Behavior.HtmlTable to allow sorting of german strings and dates
provides: [Plugin.GermanHtmlTable]
requires: [More-Behaviors/Behavior.HtmlTable, More/Locale.de-DE.Date, More/String.Extras]
script: Plugin.GermanHtmlTable.js
name: Plugin.GermanHtmlTable
...
*/

Behavior.addGlobalPlugin('HtmlTable', 'GermanHtmlTable', function(element, api, tableInstance) {
	Locale.use('de-DE');
});

HtmlTable.defineParsers({
	'string': {
		match: null,
		convert: function(){
			return this.get('text').stripTags().toLowerCase().standardize();
		}
	},
	'date': {
		match: /^\d{2}[-\. ]\d{2}[-\. ]\d{2,4}$/,
		convert: function(){
			var d = Date.parse(this.get('text').stripTags());
			return (typeOf(d) == 'date') ? d.format('db') : '';
		},
		type: 'date'
	}
});