/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2015
 */

/*global define, moment, console*/
/*eslint no-use-before-define:0, no-console:0*/

define(function(require) {

    //<webpack>
    require('famous-polyfills');
    require('famous/core/famous.css');
    require('famous-flex/widgets/styles.css');
    require('./styles.css');
    require('./index.html');
    //</webpack>

    // import dependencies
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var FlexScrollView = require('famous-flex/FlexScrollView');
    var BkImageSurface = require('famous-bkimagesurface/BkImageSurface');
    var LayoutController = require('famous-flex/LayoutController');
    var HeaderFooterLayout = require('famous-flex/layouts/HeaderFooterLayout');
    var moment = require('moment');

    // demos
    var ClockExample = require('./clock/ClockExample');
    var DateExample = require('./date/DateExample');
    var TimeExample = require('./time/TimeExample');
    var DateTimeExample = require('./datetime/DateTimeExample');

    // create the main context
    var mainContext = Engine.createContext();

    // create main layout
    var footer = _createFooter();
    var scrollView = _createScrollView();
    var layout = _createMainLayout();
    mainContext.add(layout);

    // Add examples to scrollview
    var dateWheels = [];
    _addExample(new DateTimeExample(), 'Date + Time example', true);
    _addExample(new DateExample(), 'Date example', true);
    _addExample(new TimeExample(), 'Time example', true);
    _addExample(new ClockExample(), 'Clock example');
    scrollView.setDataSource(dateWheels);

    /**
     * FIX for famous-bug: https://github.com/Famous/famous/issues/673
     *
     * There is a bug in recall which causes the latest setContent()
     * call to be ignored, if the element is removed from the DOM in
     * the next render-cycle.
     */
    Surface.prototype.recall = function recall(target) {
        if (!this._contentDirty) {
            var df = document.createDocumentFragment();
            while (target.hasChildNodes()) {
                df.appendChild(target.firstChild);
            }
            this.setContent(df);
        }
        else {
            this._contentDirty = true;
        }
    };

    //
    // Footer image
    //
    function _createFooter() {
        return new BkImageSurface({
            content: require('./images/swipe-left-right.png'),
            sizeMode: 'contain'
        });
    }

    //
    // Horizontal scrollview
    //
    function _createScrollView() {
        return new FlexScrollView({
            direction: 0,
            mouseMove: true,
            layoutOptions: {
                itemSize: undefined
            },
            paginated: true,
            layoutAll: true
        });
    }

    //
    // Header-footer layout
    //
    function _createMainLayout() {
        footer.pipe(scrollView);
        return new LayoutController({
            layout: {dock: [
                ['bottom', undefined, 15],
                ['bottom', 'footer', 100],
                ['bottom', undefined, 15],
                ['fill', 'content']
            ]},
            dataSource: {
                content: scrollView,
                footer: footer
            }
        });
    }

    //
    // Helper function for adding samples
    //
    function _addExample(dateWheel, name, debug) {
        var header = new Surface({
            content: name,
            classes: ['header']
        });
        header.pipe(scrollView);
        var lc = new LayoutController({
            layout: HeaderFooterLayout,
            layoutOptions: {
                headerSize: 60
            },
            dataSource: {
                header: header,
                content: dateWheel
            }
        });
        dateWheels.push(lc);

        if (debug) {
            dateWheel.datePicker.on('scrollstart', function(event) {
                console.log('DatePicker -> scrollstart');
            });
            dateWheel.datePicker.on('scrollend', function(event) {
                console.log('DatePicker -> scrollend (' + formatDate(event.date) + ')');
            });
            dateWheel.datePicker.on('datechange', function(event) {
                console.log('DatePicker -> datechange (' + formatDate(event.date) + ')');
            });
        }
    }

    //
    // Log events
    //
    function formatDate(date) {
        return moment(date).format('YYYY-MMM-D ddd hh:mm');
    }
});
