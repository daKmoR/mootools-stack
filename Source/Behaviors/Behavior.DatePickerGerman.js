/*
---
name: Behavior.DatePickerGerman
description: Adds a DatePicker interface (DatePicker instance)
provides: [Behavior.DatePickerGerman]
requires: [Behavior/Behavior, /DatePicker, Behavior/Element.Data, More/Object.Extras]
script: Behavior.DatePickerGerman.js

...
*/

Behavior.addGlobalFilter('DatePickerGerman', {

	defaults: {
		format: 'd.m.Y',
		days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
		months: ['Jänner', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December']
	},

	setup: function(element, api) {
		var myDatePicker = new DatePicker(element,
			Object.cleanValues(
				api.getAs({
					pickerClass: String,
					days: Array,
					months: Array,
					dayShort: Number,
					monthShort: Number,
					startDay: Number,
					timePicker: Boolean,
					timePickerOnly: Boolean,
					yearPicker: Boolean,
					yearsPerPage: Number,
					format: String,
					allowEmpty: Boolean,
					inputOutputFormat: String,
					animationDuration: Number,
					useFadeInOut: Boolean,
					startView: String,
					positionOffset: Object,
					minDate: Object,
					maxDate: Object,
					debug: Boolean,
					toggleElements: Object
				})
			)
		);
		return myDatePicker;
	}

});