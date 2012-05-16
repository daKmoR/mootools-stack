/*
---
name: Behavior.DatePicker
description: Adds a DatePicker interface to the input. [CSS:MooTools-DatePicker/Source/datepicker_dashboard/datepicker_dashboard.css]
provides: [Behavior.DatePicker]
requires: [Behavior/Behavior, MooTools-DatePicker/Picker.Date,  Behavior/Element.Data, More/Object.Extras]
script: Behavior.DatePicker.js

...
*/

Behavior.addGlobalFilter('DatePicker', {

	setup: function(element, api) {
		var myDatePicker = new Picker.Date(element, {
			pickerClass: 'datepicker_dashboard',
			startView: 'years'
		});
		return myDatePicker;
	}

});