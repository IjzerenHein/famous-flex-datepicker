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
    var RenderNode = require('famous/core/RenderNode');
    var DatePicker = require('famous-flex/widgets/DatePicker');
    var Timer = require('famous/utilities/Timer');
    var LayoutController = require('famous-flex/LayoutController');
    var ProportionalLayout = require('famous-flex/layouts/ProportionalLayout');

    function ClockExample(options) {
        View.apply(this, arguments);

        _createDatePicker.call(this);
        _createBack.call(this);
        _createSeparators.call(this);
        _createLayout.call(this);
    }
    ClockExample.prototype = Object.create(View.prototype);
    ClockExample.prototype.constructor = ClockExample;

    ClockExample.DEFAULT_OPTIONS = {
		sizeRatios: [1.3, 1, 1.3]
    };

    function _createDatePicker() {
		this.datePicker = new DatePicker({
            date: new Date(),
            wheelLayout: {
                itemSize: 80,
                diameter: 200,
                radialOpacity: -1
            },
            scrollView: {
                enabled: false
            },
            container: {
                classes: ['clock']
            },
            components: [
                new DatePicker.Component.Hour({sizeRatio: this.options.sizeRatios[0]}),
                new DatePicker.Component.Minute({sizeRatio: this.options.sizeRatios[1]}),
                new DatePicker.Component.Second({sizeRatio: this.options.sizeRatios[2]})
                //new DatePicker.Component.Millisecond()
            ]
        });

        // Update click every second
        Timer.every(function() {
            this.dateWheel.setDate(new Date());
        }.bind(this), 60);
    }

    function _createBack() {
		this.back = new Surface({
			classes: ['clock-back']
		});
    }

    function _createSeparators() {
		var separator1 = new Surface({
			classes: ['clock-separator', 'clock-separator-1'],
			content: '<div>:</div>'
		});
		var separator2 = new Surface({
			classes: ['clock-separator', 'clock-separator-2'],
			content: '<div>:</div>'
		});
		var separators = new LayoutController({
			layout: ProportionalLayout,
			layoutOptions: {
				ratios: this.options.sizeRatios
			},
			direction: 0,
			dataSource: [
				separator1,
				new RenderNode(),
				separator2
			]
		});
		this.add(separators);
    }

    function _createLayout() {
		this.layout = new LayoutController({
			layout: {dock: [
				['fill', 'back', -1000],
				['fill', 'content']
			]},
			dataSource: {
				back: this.back,
				content: this.datePicker
			}
		});
		this.add(this.layout);
    }

    module.exports = ClockExample;
});