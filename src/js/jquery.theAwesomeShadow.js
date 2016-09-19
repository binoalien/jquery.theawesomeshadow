;(function ($) {
    "use strict";

    $.fn.theAwesomeShadow = function (options) {

        // Default Settings
        var settings = $.extend({}, $.fn.theAwesomeShadow.defaults, options);


        var $w = $(window);
        // Fix render issus for transform scale
        $(this).css('backface-visibility', 'hidden');


        return this.each(function () {
            // Create element Object
            var element = new Object();
            element.selector = $(this);
            element.height = element.selector.innerHeight();
            element.top = element.selector.offset().top;
            element.bottom = element.top + element.height;

            // Errechne Shadow und Zoom pro Pixel
            element.shadowPerPixel = settings.maxshadow / element.height;
            element.zoomPerPixel = (settings.zoom - 1) / element.height;
            element.curshadow = settings.maxshadow;
            element.curzoom = settings.zoom;

            settings.API = $.extend ($.fn.theAwesomeShadow.API);

            // Set Start CSS
            settings.API.changeCSS(element.selector, [
                {
                    prob: 'transform',
                    value: 'scale3d(' + settings.zoom + ',' + settings.zoom + ',1) translate3d(0,0,0)'
                },
                {
                    prob: 'box-shadow',
                    value: settings.shadowLeftRight + 'px ' + settings.shadowTopBottom + 'px ' + settings.maxshadow + 'px 0px ' + settings.shadowcolor
                }
            ]);

            // Function bei Scroll ausführen
            $w.scroll(function () {

                // Aktuelle Position des Viewport Bottom
                var bottom_edge_y = $w.scrollTop() + $w.height() + settings.tweak;

                // If Viewport Bottom in element
                if (element.top <= bottom_edge_y && element.bottom >= bottom_edge_y) {

                    // Wo befindet sich Viewport Bottom auf dem Element
                    var vpBottomOnElement = bottom_edge_y - element.top;

                    // Errechne curshadow, shadowPerPixel * (Invertiere vpBottomOnElement)
                    element.curshadow = element.shadowPerPixel * (element.height - vpBottomOnElement);

                    // Errechne curzoom, zoomPerPixel * (Invertiere vpBottomOnElement) +1
                    element.curzoom = (element.zoomPerPixel * (element.height - vpBottomOnElement)) + 1;

                    // Animation Shadow
                    settings.API.checkIfAnimationNotEndAndChangeCSS(element.curshadow, settings.minshadow, element.selector,'box-shadow' ,settings.shadowLeftRight + 'px ' + settings.shadowTopBottom + 'px ' + element.curshadow + 'px 0px ' + settings.shadowcolor);

                    // Animation Zoom
                    settings.API.checkIfAnimationNotEndAndChangeCSS(element.curzoom, 1, element.selector, 'transform','scale3d(' + element.curzoom + ',' + element.curzoom + ',1) translate3d(0,0,0)');

                    // If Viewport Bottom über Element und curshadow ist nicht maxshadow
                } else if (element.top > bottom_edge_y && element.curshadow != settings.maxshadow) {
                    element = settings.API.outOfElement(settings.maxshadow,settings.zoom,element,settings);

                    // If Viewport Bottom unter Element und curshadow ist nicht minshadow
                } else if (element.bottom < bottom_edge_y && element.curshadow != settings.minshadow) {
                    element = settings.API.outOfElement(settings.minshadow,1,element,settings);
                }
            });
        });
    };

    $.fn.theAwesomeShadow.API = {
        changeCSS: function(elem, cssArray) {
            $.each(cssArray, function (i, css) {
                {
                    elem.css(css.prob,css.value);
                }
            });
        },
        outOfElement: function(shadow,zoom, element, settings) {
            element.curshadow = shadow;
            element.curzoom = zoom;
            settings.API.changeCSS(element.selector, [
                {
                    prob: 'box-shadow',
                    value: settings.shadowLeftRight + 'px ' + settings.shadowTopBottom + 'px ' + element.curshadow + 'px 0px ' + settings.shadowcolor
                },
                {
                    prob: 'transform',
                    value: 'scale3d(' + element.curzoom + ',' + element.curzoom + ',1) translate3d(0,0,0)'
                }
            ]);
            return element;
        },
        checkIfAnimationNotEndAndChangeCSS: function(bigger, smaller, elem, cssProb, cssValue) {
            if (bigger > smaller) {
                this.changeCSS(elem, [
                    {
                        prob: cssProb,
                        value: cssValue
                    }
                ]);
            }
        }
    };

    $.fn.theAwesomeShadow.defaults = {
        minshadow: 5,                   // Min Shadow
        maxshadow: 45,                  // Max Shadow
        zoom: 1.019,                    // Scale/Zoom
        tweak: 0,                       // Tweak (When animation starts and stops)
        shadowcolor: 'rgba(0,0,0,0.4)', // Shadow Color
        shadowLeftRight: 0,             // Shadow Horizontal Length
        shadowTopBottom: 2              // Shadow Vertical Length
    };

})(jQuery);