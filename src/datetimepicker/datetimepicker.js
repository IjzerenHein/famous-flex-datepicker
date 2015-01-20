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
    var LayoutController = require('famous-flex/LayoutController');

    function DateTimePicker(options) {
        View.apply(this, arguments);

        _createDateWheel.call(this);
        _createBack.call(this);
        _createFront.call(this);
    }
    DateTimePicker.prototype = Object.create(View.prototype);
    DateTimePicker.prototype.constructor = DateTimePicker;

    DateTimePicker.DEFAULT_OPTIONS = {
		itemHeight: 60
    };

    function _createDateWheel() {
		this.dateWheel = new DateWheel({
            date: new Date(),
            wheelLayout: {
                itemSize: this.options.itemHeight,
                diameter: 500,
                radialOpacity: 0
            },
            container: {
                classes: ['datetimepicker']
            },
            components: [
                new DateWheel.Component.FullDay({
                    format: function(date) {
                        // format full date in current locale using momentjs
                        return moment(date).format('dd DD MMM');
                    },
                    sizeRatio: 2
                }),
                new DateWheel.Component.Hour(),
                new DateWheel.Component.Minute()
            ]
        });
        this.add(this.dateWheel);
        return this.dateWheel;
    }

    function _createBack() {
		this.back = new Surface({
			classes: ['datetimepicker-back']
		});
        var mod = new Modifier({
            transform: Transform.translate(0, 0, -1000)
        });
        this.add(mod).add(this.back);
    }

    function _createFront() {
		this.top = new Surface({
            classes: ['datetimepicker-front', 'datetimepicker-front-top']
        });
        this.bottom = new Surface({
            classes: ['datetimepicker-front', 'datetimepicker-front-bottom']
        });
        this.front = new LayoutController({
            layout: function(context, options) {
                context.set('top', {
                    size: [context.size[0], (context.size[1] - this.options.itemHeight) / 2],
                    translate: [0, 0, 1]
                });
                context.set('bottom', {
                    size: [context.size[0], (context.size[1] - this.options.itemHeight) / 2],
                    translate: [0, 0, 1],
                    align: [0, 1],
                    origin: [0, 1]
                });
            }.bind(this),
            dataSource: {
                top: this.top,
                bottom: this.bottom
            }
        });
        this.add(this.front);
    }

    module.exports = DateTimePicker;
});
