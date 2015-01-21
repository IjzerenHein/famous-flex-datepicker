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
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var DatePicker = require('famous-flex/widgets/DatePicker');

    function TimeExample(options) {
        View.apply(this, arguments);

        _createDateWheel.call(this);
        _createBack.call(this);
    }
    TimeExample.prototype = Object.create(View.prototype);
    TimeExample.prototype.constructor = TimeExample;

    TimeExample.DEFAULT_OPTIONS = {
		itemHeight: 80
    };

    function _createDateWheel() {
		this.datePicker = new DatePicker({
            perspective: 500,
            date: new Date(),
            wheelLayout: {
                itemSize: this.options.itemHeight,
                diameter: 320,
                radialOpacity: 0
            },
            container: {
                classes: ['timepicker']
            },
            components: [
                new DatePicker.Component.Hour(),
                new DatePicker.Component.Minute(),
                new DatePicker.Component.Second()
            ],
            overlay: {
                top: new Surface({
                    classes: ['timepicker-overlay-top']
                }),
                bottom: new Surface({
                    classes: ['timepicker-overlay-bottom']
                })
            }
        });
        this.add(this.datePicker);
        return this.datePicker;
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

    module.exports = TimeExample;
});
