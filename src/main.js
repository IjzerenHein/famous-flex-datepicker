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
    require('./styles.css');
    require('./index.html');
    var moment = require('moment/moment');
    //</webpack>

    // import dependencies
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var FlexScrollView = require('famous-flex/FlexScrollView');
    var BkImageSurface = require('famous-bkimagesurface/BkImageSurface');
    var LayoutController = require('famous-flex/LayoutController');
    var HeaderFooterLayout = require('famous-flex/layouts/HeaderFooterLayout');
    var DateWheel = require('famous-flex/widgets/DateWheel');
    var Timer = require('famous/utilities/Timer');

    // create the main context
    var mainContext = Engine.createContext();

    // create main layout
    var footer = _createFooter();
    var scrollView = _createScrollView();
    var layout = _createMainLayout();
    mainContext.add(layout);

    // Add examples to scrollview
    var dateWheels = [];
    _addDateWheel(_createDatePicker(), 'DatePicker');
    _addDateWheel(_createDateTimePicker(), 'DateTimePicker');
    _addDateWheel(_createClock(), 'Clock');
    _addDateWheel(_createTimePicker(), 'TimePicker');
    scrollView.setDataSource(dateWheels);

    //
    // Clock example
    //
    function _createClock() {
        var clock = new DateWheel({
            date: new Date(),
            wheelLayout: {
                itemSize: 100,
                diameter: undefined,
                radialOpacity: 0
            },
            scrollView: {
                enabled: false
            },
            components: [
                new DateWheel.Component.Hour(),
                new DateWheel.Component.Minute(),
                new DateWheel.Component.Second()
                //new DateWheel.Component.Millisecond()
            ]
        });

        // Update click every second
        Timer.every(function() {
            clock.setDate(new Date());
        }, 60);
        return clock;
    }

    //
    // TimePicker example
    //
    function _createTimePicker() {
        var timePicker = new DateWheel({
            date: new Date(),
            wheelLayout: {
                itemSize: 100,
                diameter: undefined,
                radialOpacity: 0
            },
            components: [
                new DateWheel.Component.Hour(),
                new DateWheel.Component.Minute(),
                new DateWheel.Component.Second()
                //new DateWheel.Component.Millisecond()
            ]
        });
        return timePicker;
    }

    //
    // DatePicker example
    //
    function _createDatePicker() {
        var datePicker = new DateWheel({
            date: new Date(),
            wheelLayout: {
                itemSize: 100,
                diameter: undefined,
                radialOpacity: 0
            },
            components: [
                new DateWheel.Component.Day(),
                new DateWheel.Component.Month({
                    format: function(date) {
                        // format full date in current locale using momentjs
                        return moment(date).format('MMMM');
                    },
                    sizeRatio: 2
                }),
                new DateWheel.Component.Year()
            ]
        });
        return datePicker;
    }

    //
    // DateTimePicker example
    //
    function _createDateTimePicker() {
        var datePicker = new DateWheel({
            date: new Date(),
            wheelLayout: {
                itemSize: 100,
                diameter: undefined,
                radialOpacity: 0
            },
            components: [
                new DateWheel.Component.FullDay({
                    format: function(date) {
                        // format full date in current locale using momentjs
                        return moment(date).format('ddd ll');
                    },
                    sizeRatio: 4
                }),
                new DateWheel.Component.Hour(),
                new DateWheel.Component.Minute()
            ]
        });
        return datePicker;
    }

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
            paginated: true
        });
    }

    //
    // Header-footer layout
    //
    function _createMainLayout() {
        footer.pipe(scrollView);
        return new LayoutController({
            layout: {dock: [
                ['bottom', undefined, 10],
                ['bottom', 'footer', 100],
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
    function _addDateWheel(dateWheel, name) {
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
    }

    //
    // Log events
    //
    /*function formatDate(date) {
        return moment(date).format('YYYY-MMM-D ddd hh:mm');
    }
    dateWheel.on('scrollstart', function(event) {
        console.log('DateWheel -> scrollstart');
    });
    dateWheel.on('scrollend', function(event) {
        console.log('DateWheel -> scrollend (' + formatDate(event.date) + ')');
    });
    dateWheel.on('datechange', function(event) {
        console.log('DateWheel -> datechange (' + formatDate(event.date) + ')');
    });*/
});
