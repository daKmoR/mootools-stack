/*
---
name: Behavior.DatePicker
description: Adds a DatePicker interface (DatePicker instance)
provides: [Behavior.DatePicker]
requires: [Behavior/Behavior, Picker.Date,  Behavior/Element.Data, More/Object.Extras, More/Locale.de-DE.Date]
script: Behavior.DatePicker.js

...
*/

Behavior.addGlobalFilter('DatePicker', {

	setup: function(element, api) {
		Locale.use('de-DE');
		var myDatePicker = new Picker.Date(element, {
			pickerClass: 'datepicker_dashboard',
			startView: 'years'
		});
		return myDatePicker;
	}

});