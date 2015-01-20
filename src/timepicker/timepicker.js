/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2015
 */

/*global define, console*/
/*eslint no-use-before-define:0, no-console:0 */

define(function(require, exports, module) {

    // import dependencies
    require('./styles.css');
    var View = require('famous/core/View');
    var RenderNode = require('famous/core/RenderNode');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var DateWheel = require('famous-flex/widgets/DateWheel');
    var LayoutController = require('famous-flex/LayoutController');
    var ProportionalLayout = require('famous-flex/layouts/ProportionalLayout');

    function TimePicker(options) {
        View.apply(this, arguments);

        _createDateWheel.call(this);
        _createBack.call(this);
        _createFront.call(this);
    }
    TimePicker.prototype = Object.create(View.prototype);
    TimePicker.prototype.constructor = TimePicker;

    TimePicker.DEFAULT_OPTIONS = {
		itemHeight: 80
    };

    function _createDateWheel() {
		this.dateWheel = new DateWheel({
            perspective: 0,
            date: new Date(),
            wheelLayout: {
                itemSize: this.options.itemHeight,
                diameter: 400,
                radialOpacity: -0.5
            },
            container: {
                classes: ['timepicker']
            },
            components: [
                new DateWheel.Component.Hour(),
                new DateWheel.Component.Minute(),
                new DateWheel.Component.Second()
            ]
        });
        this.add(this.dateWheel);
        return this.dateWheel;
    }

    function _createBack() {
        this.back = new Surface({
            classes: ['timepicker-back']
        });
        var mod = new Modifier({
            transform: Transform.translate(0, 0, -1000)
        });
        this.add(mod).add(this.back);
    }

    function _createFront() {
        this.front = new Surface({
            classes: ['timepicker-front']
        });
        var mod = new Modifier({
            align: [0, 0.5],
            origin: [0, 0.5],
            size: [undefined, this.options.itemHeight],
            transform: Transform.translate(0, 0, 1)
        });
        this.add(mod).add(this.front);
    }

    module.exports = TimePicker;
});
