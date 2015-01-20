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
    var DateWheel = require('famous-flex/widgets/DateWheel');

    function DatePicker(options) {
        View.apply(this, arguments);

        _createDateWheel.call(this);
        _createBack.call(this);
        _createFront.call(this);
    }
    DatePicker.prototype = Object.create(View.prototype);
    DatePicker.prototype.constructor = DatePicker;

    DatePicker.DEFAULT_OPTIONS = {
		itemHeight: 60
    };

    function _createDateWheel() {
		this.dateWheel = new DateWheel({
            date: new Date(),
            wheelLayout: {
                itemSize: this.options.itemHeight,
                diameter: 500,
                radialOpacity: -1
            },
            container: {
                classes: ['datepicker']
            },
            components: [
                new DateWheel.Component.Day(),
                new DateWheel.Component.Month({
                    format: function(date) {
                        // format full date in current locale using momentjs
                        return moment(date).format('MMMM');
                    },
                    sizeRatio: 3
                }),
                new DateWheel.Component.Year({
                    sizeRatio: 2
                })
            ]
        });
        this.add(this.dateWheel);
        return this.dateWheel;
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

    function _createFront() {
		this.front = new Surface({
            classes: ['datepicker-front']
        });
        var mod = new Modifier({
            align: [0, 0.5],
            origin: [0, 0.5],
            size: [undefined, this.options.itemHeight],
            transform: Transform.translate(0, 0, 1)
        });
        this.add(mod).add(this.front);
    }

    module.exports = DatePicker;
});
