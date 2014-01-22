/*
---
name: Behavior.date-picker
description: Adds a DatePicker interface to the input. [CSS:MooTools-DatePicker/Source/datepicker_vista/datepicker_vista.css]
provides: [Behavior.DatePicker]
requires: [Behavior/Behavior, MooTools-DatePicker/Picker.Date,  Behavior/Element.Data, More/Object.Extras]
script: Behavior.date-picker.js

...
*/

Behavior.addGlobalFilter('date-picker', {

	setup: function(element, api) {
		var myDatePicker = new Picker.Date(element, {
			pickerClass: 'datepicker_vista',
			maxDate: Date.now()
		});
		return myDatePicker;
	}

});