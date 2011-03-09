/*
---

name: SubObjectMapping

description: SubObjectMapping

license: MIT-style license

authors:
	- Thomas Allmer

requires: [Core/Class, Core/Object, Core/Functions]

provides: [SubObjectMapping]

...
*/

this.SubObjectMapping = new Class({
	
	mapToSubObject: function() {
		Object.each(this.subObjectMapping, function(subObjectOptions, subObject) {
			subObject = eval(subObject);
			if (subObjectOptions.functions !== undefined && subObjectOptions.functions.length > 0) {
				this.mapFunctions(subObjectOptions.functions, subObject);
			}
			
			if (subObjectOptions.events !== undefined && subObjectOptions.events.length > 0) {
			  var eventInstance = subObjectOptions.eventInstance.length > 0 ? eval(subObjectOptions.eventInstance) : null;
				var eventAddFunction = subObjectOptions.eventAddFunction.length > 0 ? subObjectOptions.eventAddFunction : 'addEvent';
				this.mapEvents(subObjectOptions.events, subObject, eventInstance, eventAddFunction);
			}
		}, this);
	},
	
	mapFunctions: function(functions, subObject) {
		functions.each(function(curFunction) {
			var getFunction = 'get' + curFunction.capitalize();
			this[getFunction] = function() {
				return subObject[getFunction]();
			}
			
			var setFunction = 'set' + curFunction.capitalize();
			this[setFunction] = function() {
				var argument = arguments[0] || subObject[getFunction]();
				subObject[setFunction](argument);
			}.bind(this);
		}, this);
	},
	
	mapEvents: function(events, subObject, eventInstance, eventAdd) {
		events.each(function(eventName) {
			eventInstance[eventAdd](subObject, eventName, function(e) {
				this.fireEvent(eventName, e);
			}.bind(this));
		}, this);
	}

});