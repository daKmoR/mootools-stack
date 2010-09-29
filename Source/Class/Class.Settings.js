/*
---

name: Class.Settings

description: allows to use predefined option sets from the SettingsStore in the setOptions, just use options.setting = 'stringFromOptionSet'

license: MIT-style license.

requires: Core/Class.Extras

provides: [SettingsStore, Settings, Class.Settings]

...
*/


var SettingsStore = {};

this.Settings = new Class({
	Extends: Options,

	setOptions: function(options) {
		if( options !== null && options !== undefined && options.setting !== null && options.setting !== undefined ) {
			var setting = options.setting.split('.');
			if( SettingsStore[setting[0]][setting[1]] != null )
				this.setOptions( SettingsStore[setting[0]][setting[1]] );
			else if( SettingsStore[setting[0]] != null )
				this.setOptions( SettingsStore[setting[0]] );
		}
		return this.parent(options);
	}

});