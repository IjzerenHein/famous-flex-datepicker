/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/*global define, console*/
/*eslint no-use-before-define:0, no-console:0 */

/**
 * Date/time picker-wheel for famo.us.
 *
 * @module
 */
define(function(require, exports, module) {

    // import dependencies
    var View = require('famous/core/View');
    var Utility = require('famous/utilities/Utility');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var LayoutController = require('famous-flex/LayoutController');
    var ScrollController = require('famous-flex/ScrollController');
    var WheelLayout = require('famous-flex/layouts/WheelLayout');
    var ProportionalLayout = require('famous-flex/layouts/ProportionalLayout');
    var VirtualViewSequence = require('./VirtualViewSequence');
    var DatePickerComponents = require('./DatePickerComponents');

    /**
     * @class
     * @extends View
     * @param {Object} options Configurable options.
     * @param {Number} [options.perspective] Perspective to use when rendering the wheel.
     * @alias module:DatePicker
     */
    function DatePicker(options) {
        View.apply(this, arguments);

        this._date = new Date((options && options.date) ? options.date.getTime() : undefined);
        _createLayout.call(this);
        _createComponents.call(this);

        this.setOptions(this.options);
    }
    DatePicker.prototype = Object.create(View.prototype);
    DatePicker.prototype.constructor = DatePicker;
    DatePicker.Component = DatePickerComponents;

    DatePicker.DEFAULT_OPTIONS = {
        perspective: 1000,
        wheelOptions: {
            itemSize: 100,
            diameter: 500
        },
        container: {
            classes: ['famous-flex-datepicker']
        },
        components: [
            new DatePicker.Component.FullDay(),
            new DatePicker.Component.Hour(),
            new DatePicker.Component.Minute()
        ]
    };

    /**
     * Patches the DatePicker instance's options with the passed-in ones.
     *
     * @param {Object} options Configurable options (see ScrollController for all inherited options).
     * @param {Number} [options.perspective] Perspective to use when rendering the wheel.
     * @return {DatePicker} this
     */
    DatePicker.prototype.setOptions = function(options) {
        View.prototype.setOptions.call(this, options);
        if (!this.layout) {
            return this;
        }
        if (options.perspective !== undefined) {
            this.container.context.setPerspective(options.perspective);
        }
        if (options.components) {
            _createComponents.call(this);
        }
        if (options.wheelOptions !== undefined) {
            for (var i = 0; i < this.components.length; i++) {
                this.components[i].scrollView.setLayoutOptions(options.wheelOptions);
            }
        }
        return this;
    };

    /**
     * Set the selected date.
     *
     * @param {Date} date Selected date/time.
     * @return {DatePicker} this
     */
    DatePicker.prototype.setDate = function(date) {
        this._date.setTime(date.getTime());
        _setDateToScrollWheels.call(this, this._date);
        return this;
    };

    /**
     * Get the selected date.
     *
     * @return {Date} selected date
     */
    DatePicker.prototype.getDate = function() {
        return this._date;
    };

    /**
     * Selects the given date into the scrollwheels (causes scrolling)
     */
    function _setDateToScrollWheels(date) {
        for (var i = 0; i < this.scrollWheels.length; i++) {
            var scrollWheel = this.scrollWheels[i];
            var component = scrollWheel.component;
            var item = scrollWheel.scrollView.getFirstVisibleItem();
            if (item && item.viewSequence) {
                var viewSequence = item.viewSequence;
                var renderNode = item.viewSequence.get();
                var currentValue = component.getComponent(renderNode.date);
                var destValue = component.getComponent(date);

                // Determine the direction to scroll to
                var steps = 0;
                if (currentValue !== destValue) {
                    steps = destValue - currentValue;
                    // when loop is enables, check whether there is a faster path
                    if (component.loop) {
                        var revSteps = (steps < 0) ? (steps + component.upperBound) : (steps - component.upperBound);
                        if (Math.abs(revSteps) < Math.abs(steps)) {
                            steps = revSteps;
                        }
                    }
                }

                // Scroll to the item
                if (!steps) {
                    scrollWheel.scrollView.goToRenderNode(renderNode);
                }
                else {
                    while (currentValue !== destValue) {
                        viewSequence = (steps > 0) ? viewSequence.getNext() : viewSequence.getPrevious();
                        renderNode = viewSequence ? viewSequence.get() : undefined;
                        if (!renderNode) {
                            break;
                        }
                        currentValue = component.getComponent(renderNode.date);
                        if (steps > 0) {
                            scrollWheel.scrollView.goToNextPage();
                        }
                        else {
                            scrollWheel.scrollView.goToPreviousPage();
                        }
                    }
                }
            }
        }
    }

    /**
     * Gets the selected date from all the scroll-wheels.
     */
    function _getDateFromScrollWheels() {
        var date = new Date(this._date);
        for (var i = 0; i < this.scrollWheels.length; i++) {
            var scrollWheel = this.scrollWheels[i];
            var component = scrollWheel.component;
            var item = scrollWheel.scrollView.getFirstVisibleItem();
            if (item && item.renderNode) {
                component.setComponent(date, component.getComponent(item.renderNode.date));
            }
        }
        return date;
    }

    /**
     * Sets up the overal layout
     */
    function _createLayout() {
        this.container = new ContainerSurface(
            this.options.container
        );
        this.layout = new LayoutController({
            layout: ProportionalLayout,
            layoutOptions: {
                ratios: []
            },
            direction: Utility.Direction.X,
            flow: true,
            reflowOnResize: false
        });
        this.container.add(this.layout);
        this.add(this.container);
        this.components = [];
    }

    /**
     * Emit scrollstart event when a wheel starts scrolling
     */
    function _scrollWheelScrollStart() {
        this._scrollingCount++;
        if (this._scrollingCount === 1) {
            this._eventOutput.emit('scrollstart', {
                target: this
            });
        }
    }

    /**
     * Emit scrollend event whenever all scrolling has come to a halt
     */
    function _scrollWheelScrollEnd() {
        this._scrollingCount--;
        if (this._scrollingCount === 0) {
            this._eventOutput.emit('scrollend', {
                target: this,
                date: this._date
            });
        }
    }

    /**
     * Emit scrollend event whenever all scrolling has come to a halt
     */
    function _scrollWheelPageChange() {
        this._date = _getDateFromScrollWheels.call(this);
        this._eventOutput.emit('datechange', {
            target: this,
            date: this._date
        });
    }

    /**
     * Updates the date/time components
     */
    function _createComponents() {
        this.scrollWheels = [];
        this._scrollingCount = 0;
        var dataSource = [];
        var sizeRatios = [];

        for (var i = 0; i < this.options.components.length; i++) {
            var component = this.options.components[i];
            var viewSequence = new VirtualViewSequence({
                factory: component,
                value: component.create(this._date)
            });
            var scrollView = new ScrollController({
                layout: WheelLayout,
                layoutOptions: this.options.wheelOptions,
                flow: false,
                direction: Utility.Direction.Y,
                dataSource: viewSequence,
                mouseMove: true,
                autoPipeEvents: true,
                paginated: false,
                debug: true
            });
            scrollView.on('scrollstart', _scrollWheelScrollStart.bind(this));
            scrollView.on('scrollend', _scrollWheelScrollEnd.bind(this));
            scrollView.on('pagechange', _scrollWheelPageChange.bind(this));
            this.scrollWheels.push({
                component: component,
                scrollView: scrollView,
                viewSequence: viewSequence
            });
            dataSource.push(scrollView);
            sizeRatios.push(component.sizeRatio);
        }

        this.layout.setDataSource(dataSource);
        this.layout.setLayoutOptions({
            ratios: sizeRatios
        });
    }

    module.exports = DatePicker;
});
