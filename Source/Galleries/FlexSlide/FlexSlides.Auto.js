/*
---

name: FlexSlides.Auto

description: create automatic FlexSlides for all CSS-Classes "FlexSlide"

license: MIT-style license.

requires: [FlexSlides, Core/DomReady]

provides: FlexSlides.Auto

...
*/ 

window.addEvent('domready', function() {
	FlexSlides.Auto = new FlexSlides('.FlexSlide');
});