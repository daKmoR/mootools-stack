/*
---
name: Behavior.DatePicker
description: Adds a DatePicker interface (DatePicker instance)
provides: [Behavior.DatePicker]
requires: [Behavior/Behavior, /DatePicker, Behavior/Element.Data, More/Object.Extras]
script: Behavior.DatePicker.js

...
*/

Behavior.addGlobalFilter('DatePicker', {

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