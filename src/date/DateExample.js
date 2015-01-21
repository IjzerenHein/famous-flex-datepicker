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
    var moment = require('moment/moment');
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var DatePicker = require('famous-flex/widgets/DatePicker');

    function DateExample(options) {
        View.apply(this, arguments);

        _createDatePicker.call(this);
        _createBack.call(this);
    }
    DateExample.prototype = Object.create(View.prototype);
    DateExample.prototype.constructor = DateExample;

    function _createDatePicker() {
        this.datePicker = new DatePicker({
            date: new Date(),
            perspective: 500,
            wheelLayout: {
                itemSize: 60,
                diameter: 320,
                radialOpacity: -0.5
            },
            container: {
                classes: ['datepicker']
            }
        });
        this.datePicker.setComponents([
            new DatePicker.Component.Day(),
            new DatePicker.Component.Month({
                format: function(date) {
                    // format full date in current locale using momentjs
                    return moment(date).format('MMMM');
                },
                sizeRatio: 3
            }),
            new DatePicker.Component.Year({
                sizeRatio: 2
            })
        ]);
        this.datePicker.setOverlay({
            top: new Surface({
                classes: ['datepicker-overlay-top']
            }),
            bottom: new Surface({
                classes: ['datepicker-overlay-bottom']
            })
        });
        this.add(this.datePicker);
        return this.datePicker;
    }

    function _createBack() {
        this.back = new Surface({
            classes: ['datepicker-back']
        });
        var mod = new Modifier({
            transform: Transform.translate(0, 0, -1000)
        });
        this.add(mod).add(this.back);
    }

    module.exports = DateExample;
});
