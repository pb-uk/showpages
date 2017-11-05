// ShowPages displays slide shows of web pages.
//
// ## Usage
// Create a new ShowPages object with an array of urls and a map of any options and run it:
//
//     new ShowPages(urls, options).run();
//
// ### Options
// `interval` (default `3000`)
//
// The interval between displaying pages in milliseconds.
//
// `transition` (default `crossfade`)
//
// The type of transition between pages.
//
// `duration` (default `1000`)
//
// The duration of any transition effects in milliseconds.
//
// ----
/**
 * Display a rolling slide show of web pages.
 *
 * @constructor
 * @param {string[]} urls    URLs of pages to load.
 * @param {Object}   options Hash of options to set.
**/
var ShowPages = function (urls, options) {

    var
        /** @var {integer} ShowPages~current The index of the current page. */
        current,

        /** @var {Object.<string>} ShowPages~defaults Default settings. */
        defaults = {
            interval: 3000,
            transition: 'crossfade',
            duration: 1000
        },

        /** @var {jQuery} ShowPages~$container The containing HTML element. */
        $container,

        /** @var {Object[]} ShowPages~pages The pages in this show. */
        pages = [],

        /** @var {Object} ShowPages~settings Hash of current settings. */
        settings = {},

        /** @var {this} ShowPages~this Self-reference. */
        that = this;

    // Internal method to create a page and add it to the array of pages.
    /**
     * Create a page and add it to the array of pages.
     *
     * @param {string} url The url of the page to add.
    **/
    function addPageElement(url) {
        var $el = $('<iframe>')
            .css({
                display: 'none',
                background: 'transparent',
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                margin: 0,
                border: 0,
                padding: 0,
            })
            // Set the url for the page.
            .attr('src', url)
            // Add the page to the container..
            .appendTo($container);
        // Add the page to the array of pages.
        pages.push({
            '$el': $el
        });
    }

    // Internal method run on instantiation.
    /**
     * Initialize the object on instantiation.
    **/
    function initialize() {
        // Set the options.
        settings = $.extend({}, defaults, options),

        // Create the container element exactly filling the viewport and insert it into the DOM.
        $container = $('<div>')
            .css({
                position: 'fixed',
                width: '100%',
                top: '0',
                left: '0',
                background: '#ffffff'
            })
            .height(window.innerHeight);
        $container.appendTo('body');

        // Add all the provided urls as pages.
        for (var i = 0; i < urls.length; i++) {
            addPageElement(urls[i]);
        }
    }

    // Internal method to display the next page in the show.
    /**
     * Display the next page in the show.
    **/
    function showNext() {
        var last = current;
        current++;
        if (current == pages.length) {
            current = 0;
        }
        transition(pages[last].$el, pages[current].$el, settings.transition);
    }

    // Internal method to transition from one slide to another.
    /**
     * Transition from one jQuery DOM element to another.
     *
     * @param {jQuery} $old       The old slide element.
     * @param {jQuery} $new       The new slide element.
     * @param {string} transition The transition to apply.
     * @param {Object} options    Hash of options.
    **/
    function transition($old, $new, transition, options) {
        var defaults = {
            duration: settings.duration
        };
        that.transitions[transition]($old, $new, $.extend({}, defaults, options));
    }

    // Public method to run the show.
    /**
     * Run the show.
    **/
    this.run = function () {
        // Show the first slide.
        current = 0;
        transition(pages[current].$el, pages[current].$el, 'show');
        // Show the rest of the slides.
        setInterval(showNext, settings.interval);
    };

    // Initialize the object on instantiation.
    initialize();

};

// ## Transitions
ShowPages.prototype.transitions = {
    // Fade the old slide out and the new one in simultaneously.
    crossfade: function ($old, $new, options) {
        $old.fadeOut(options.duration);
        $new.fadeIn(options.duration);
    },
    // Fade the old slide out before fading in the new one. The option `out` sets the
    // proportion of the duration taken fading out (default `0.5` _i.e._ 50%).
    fade: function ($old, $new, options) {
        var defaults = {
            out: 0.5
        };
        var settings = $.extend({}, defaults, options);
        $old.fadeOut(settings.duration * settings.out, function () {
            $new.fadeIn(settings.duration * (1 - settings.out));
        });
    },
    // Hide the old slide straight away and fade in the new one.
    fadeIn: function ($old, $new, options) {
        $old.hide();
        $new.fadeIn(options.duration);
    },
    // Fade the old slide out and then show the new one.
    fadeOut: function ($old, $new, options) {
        $old.fadeOut(options.duration, function () {
            $new.show();
        });
    },
    // Hide the old slide and show the new one.
    show: function ($old, $new, options) {
        $old.hide();
        $new.show();
    },
    // Slide the new slide(!) down over the old one.
    slideDown: function ($old, $new, options) {
        $new.slideDown(options.duration, function () {
            $old.hide();
        });
    }
};
