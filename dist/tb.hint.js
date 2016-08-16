/*
 *  Jquery Hint - v1.0
 *  A simple hint (helper) for any web app
 *
 *  Made by Thinh Bui
 *  Under MIT License
 */
;(function ($, window, document, undefined) {

    // Create the defaults once
    var pluginName = 'TBHint',
        defaults   = {
            pointPosition: 'top-left',
            messageBoxWidth: 250,
            messageBoxPosition: 'left',
            message: 'Please fill in message.'
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;

        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.vars = {
            els: null,
            currentHintIndex: 0
        };
        this.utils = {
            // Build hint using specific point object and Plugin object's options
            buildHint: function (options, thisPlugin) {
                // Extend global options and use specific point options
                var pointOptions = $.extend({}, {
                        pointPosition: thisPlugin.options.pointPosition,
                    }, options),
                    pointsHTML   = '',
                    styleJson    = {
                        position: 'absolute'
                    };

                // Parsing point position
                switch (pointOptions.pointPosition) {
                    case 'top-left':
                        styleJson = $.extend(styleJson, {
                            top: '0',
                            left: '0'
                        });
                        break;
                    case 'top-center':
                        styleJson = $.extend(styleJson, {
                            top: '0',
                            left: '50%'
                        });
                        break;
                    case 'top-right':
                        styleJson = $.extend(styleJson, {
                            top: '0',
                            right: '0'
                        });
                        break;
                    case 'right-center':
                        styleJson = $.extend(styleJson, {
                            top: '50%',
                            right: '0'
                        });
                        break;
                    case 'bottom-right':
                        styleJson = $.extend(styleJson, {
                            bottom: '0',
                            right: '0'
                        });
                        break;
                    case 'bottom-center':
                        styleJson = $.extend(styleJson, {
                            bottom: '0',
                            right: '50%'
                        });
                        break;
                    case 'bottom-left':
                        styleJson = $.extend(styleJson, {
                            bottom: '0',
                            left: '0'
                        });
                        break;
                    case 'left-center':
                        styleJson = $.extend(styleJson, {
                            bottom: '50%',
                            left: '0'
                        });
                        break;
                }

                // Build point html
                pointsHTML +=
                    '<div class="entry-hint-point" style="' + this.parseCSS(styleJson) + '">'
                    + '<div class="entry-blinking-point"></div>'
                    + this.buildHintMessage(options, thisPlugin)
                    + '</div>'
                ;
                return pointsHTML;
            },
            buildHintMessage: function (options, thisPlugin) {
                // Extend global options and use specific point options
                var pointOptions = $.extend({}, {
                        messageBoxWidth: thisPlugin.options.messageBoxWidth,
                        messageBoxPosition: thisPlugin.options.messageBoxPosition,
                        message: thisPlugin.options.message
                    }, options),
                    messageHTML  = '',
                    styleJson    = {
                        position: 'absolute',
                        width: pointOptions.messageBoxWidth + 'px'
                    };

                // Parsing message position
                switch (pointOptions.messageBoxPosition) {
                    case 'top':
                        styleJson = $.extend(styleJson, {
                            bottom: '15px',
                            left: '50%',
                            'margin-left': -thisPlugin.options.messageBoxWidth / 2 + 'px'
                        });
                        break;
                    case 'right':
                        styleJson = $.extend(styleJson, {
                            top: '-15px', // @todo: align middle
                            left: '15px'
                        });
                        break;
                    case 'bottom':
                        styleJson = $.extend(styleJson, {
                            top: '15px',
                            left: '50%',
                            'margin-left': -thisPlugin.options.messageBoxWidth / 2 + 'px'
                        });
                        break;
                    case 'left':
                        styleJson = $.extend(styleJson, {
                            top: '-15px', // @todo: align middle
                            right: '15px'
                        });
                        break;
                }

                // Build point html
                messageHTML +=
                    '<div class="entry-message" style="' + this.parseCSS(styleJson) + '">'
                    + '<span>'
                    + pointOptions.message
                    + '</span>'
                    + '<div class="entry-actions">'
                    + '<a href="#" class="tb-button skip">Skip</a>'
                    + '<a href="#" class="tb-button next">Next</a>'
                    + '</div>'
                    + '</div>'
                ;
                return messageHTML;
            },
            //
            parseCSS: function (json) {
                var output = '';
                $.each(json, function (index, el) {
                    output += index + ':' + el + ';';
                });
                return output.substring(0, output.length - 1);
            },
            // Show a single hint
            hint: {
                show: function ($point, nextButtonText) {
                    // Make sure the current highlighting el is on top
                    $point.closest('[data-tb-hint-order]').css({
                        'z-index': 101
                    });

                    // Animating message
                    $point
                    .find('.entry-message')
                    .stop()
                    .css({
                        display: "block"
                    })
                    .animate({
                        opacity: 1,
                        'margin-right': 0
                    }, 500);

                    // Animate html
                    $('html, body').animate({
                        scrollTop: $point.offset().top - 200
                    }, 500, 'easeInOutExpo');

                    // Update next button text
                    $point.find('.ht-button.next').text(nextButtonText);
                },
                hide: function ($point) {
                    // Reset z-index which set at showing
                    $point.closest('[data-tb-hint-order]').css({
                        'z-index': 100
                    });
                    // Animating message
                    $point.find('.entry-message')
                    .stop()
                    .css({
                        display: "block",
                    })
                    .animate({
                        opacity: 0,
                        'margin-right': 30
                    }, 500, function () {
                        $(this).css({display: "block"})
                    })
                }
            },
            sortByDataOrder: function ($els) {
                // Bubble sort
                var swapped;
                do {
                    swapped = false;
                    $els.each(function (index, el) {
                        if ($($els[index]).data('tb-hint-order') > $($els[index + 1]).data('tb-hint-order')) {
                            var temp = $els[index];
                            $els[index] = $els[index + 1];
                            $els[index + 1] = temp;
                            swapped = true;
                        }
                    });
                } while (swapped);
                return $els;
            }
        };
        this.startLoopHint = function () {
            // Append overlay and add necessary class
            $('body')
            .prepend('<div class="tb-hint-overlay"></div>')
            .addClass('hint-is-showing');
            // Build hint points' content
            this.buildPoints();
            // Show the first one
            if (this.vars.els.length > 0) {
                // Set current hint index = 0 (the first one)
                this.vars.currentHintIndex = 0;
                // Show the first message hint
                this.utils.hint.show($(this.vars.els[this.vars.currentHintIndex]));
            }
            // Handle action (next/skip)
            this.handleActions();
        };
        this.buildPoints = function () {
            var _this = this;
            this.vars.els.each(function (index, el) {
                var position = $(el).css('position') === 'static' ? 'relative' : $(el).css('position');
                $(el).css({
                    'z-index': 100,
                    position: position,
                    overflow: 'visible'
                });
                // Get specific point's options,
                // build point using these option extend global options (pass _this to get global options)
                // then append to target
                $(el).append(_this.utils.buildHint({
                    pointPosition: $(el).data('tb-hint-point-position'),
                    messageBoxWidth: $(el).data('tb-hint-message-box-width'),
                    messageBoxPosition: $(el).data('tb-hint-message-box-position'),
                    message: $(el).data('tb-hint-message')
                }, _this));
            });
        };
        this.handleActions = function () {
            var _this = this;
            $('.entry-hint-point .next').on('click', function (e) {
                _this.showNextPoint();
                e.preventDefault();
            });
            $('.entry-hint-point .skip').on('click', function (e) {
                _this.destroy();
                e.preventDefault();
            });
            $('.entry-hint-point .entry-blinking-point').on('click', function (e) {
                var $currentPoint = $(this).closest('[data-tb-hint-order]');
                _this.showCustomPoint(_this.findPointIndex($currentPoint));
                e.preventDefault();
            });
        };
        this.showNextPoint = function () {
            var _this = this;
            // var currentHintIndex = _this.vars.currentHintIndex;
            // Hide current hint
            _this.utils.hint.hide($(_this.vars.els[_this.vars.currentHintIndex]));
            // Check if next hint exist
            if ($(_this.vars.els[_this.vars.currentHintIndex + 1]).length > 0) {
                // Proceed to next hint
                _this.vars.currentHintIndex++;
                // Consider next button text: Next or Finish
                if ($(_this.vars.els[_this.vars.currentHintIndex + 1]).length == 0) {
                    _this.utils.hint.show($(_this.vars.els[_this.vars.currentHintIndex]), 'Finish');
                } else {
                    _this.utils.hint.show($(_this.vars.els[_this.vars.currentHintIndex]), 'Next');
                }
            }
            // If next hint doesn't exist
            else {
                _this.destroy();
            }
        };
        this.showCustomPoint = function (index) {
            var _this = this;
            // var currentHintIndex = _this.vars.currentHintIndex;
            // Hide current hint
            _this.utils.hint.hide($(_this.vars.els[_this.vars.currentHintIndex]));
            // Proceed to next hint
            _this.vars.currentHintIndex = index;
            // Consider next button text: Next or Finish
            if ($(_this.vars.els[_this.vars.currentHintIndex + 1]).length == 0) {
                _this.utils.hint.show($(_this.vars.els[_this.vars.currentHintIndex]), 'Finish');
            } else {
                _this.utils.hint.show($(_this.vars.els[_this.vars.currentHintIndex]), 'Next');
            }
        };
        // Find point index in els list
        this.findPointIndex = function ($point) {
            var outputIndex = 0;
            this.vars.els.each(function (index, el) {
                // console.log($(el).data('tb-hint-order') + ' vs ' + $point.data('tb-hint-order') + '. Current Index: ' + index);
                if ($(el).data('tb-hint-order') === $point.data('tb-hint-order')) {
                    outputIndex = index;
                }
            });
            return outputIndex;
        };
        this.destroy = function () {
            $('.tb-hint-overlay, .entry-hint-point').remove();
            $('body').removeClass('hint-is-showing');
            this.vars.els.removeAttr('style');
            this.currentHintIndex = 0;
        };

        this.init();
    }

    // Define init function
    $.extend(Plugin.prototype, {
        init: function () {
            // Check if hint group doesn't exist
            if (this.element.length == 0)
                return;
            // Get all sorted els in group
            this.vars.els = this.utils.sortByDataOrder(this.element);
            // Start
            this.startLoopHint();
        }
    });

    $.fn[pluginName] = function (options) {
        if (!$.data(this, 'plugin_' + pluginName)) {
            $.data(this, 'plugin_' + pluginName,
                new Plugin(this, options));
        }
    }

})(jQuery, window, document);


$(document).on('click', '#pbl-help', function (e) {
    $('[data-tb-hint-group="group-1"]').TBHint();
    e.preventDefault();
});
