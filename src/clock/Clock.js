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
    var DateWheel = require('famous-flex/widgets/DateWheel');
    var Timer = require('famous/utilities/Timer');
    var LayoutController = require('famous-flex/LayoutController');
    var ProportionalLayout = require('famous-flex/layouts/ProportionalLayout');

    function Clock(options) {
        View.apply(this, arguments);

        _createDateWheel.call(this);
        _createBack.call(this);
        _createSeparators.call(this);
        _createLayout.call(this);
    }
    Clock.prototype = Object.create(View.prototype);
    Clock.prototype.constructor = Clock;

    Clock.DEFAULT_OPTIONS = {
		sizeRatios: [1.3, 1, 1.3]
    };

    function _createDateWheel() {
		this.dateWheel = new DateWheel({
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
                new DateWheel.Component.Hour({sizeRatio: this.options.sizeRatios[0]}),
                new DateWheel.Component.Minute({sizeRatio: this.options.sizeRatios[1]}),
                new DateWheel.Component.Second({sizeRatio: this.options.sizeRatios[2]})
                //new DateWheel.Component.Millisecond()
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
				content: this.dateWheel
			}
		});
		this.add(this.layout);
    }

    module.exports = Clock;
});
