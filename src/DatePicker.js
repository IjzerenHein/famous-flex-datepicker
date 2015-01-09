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
    var InfiniteViewSequence = require('./InfiniteViewSequence');
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

        _createLayout.call(this);
        _updateComponents.call(this);

        this.setOptions(this.options);
    }
    DatePicker.prototype = Object.create(View.prototype);
    DatePicker.prototype.constructor = DatePicker;

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
            new DatePickerComponents.Year(),
            new DatePickerComponents.Month(),
            new DatePickerComponents.WeekDay(),
            new DatePickerComponents.FullDay(),
            new DatePickerComponents.Hour(),
            new DatePickerComponents.Minute()
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
        if (options.perspective !== undefined) {
            this.container.context.setPerspective(options.perspective);
        }
        if (options.components) {
            _updateComponents.call(this);
        }
        if (options.wheelOptions !== undefined) {
            for (var i = 0; i < this.components.length; i++) {
                this.components[i].scrollView.setLayoutOptions(options.wheelOptions);
            }
        }
    };

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
                ratios: [1]
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
     * Updates the date/time components
     */
    function _updateComponents() {
        this.scrollWheels = [];
        var dataSource = [];
        var sizeRatios = [];

        for (var i = 0; i < this.options.components.length; i++) {
            var component = this.options.components[i];
            var viewSequence = new InfiniteViewSequence({
                delegate: component
            });
            var scrollView = new ScrollController({
                layout: WheelLayout,
                layoutOptions: this.options.wheelOptions,
                flow: false,
                direction: Utility.Direction.Y,
                dataSource: viewSequence,
                mouseMove: true,
                autoPipeEvents: true
            });
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
