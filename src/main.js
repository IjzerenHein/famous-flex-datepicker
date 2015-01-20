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
    var Timer = require('famous/utilities/Timer');
    var DateWheel = require('famous-flex/widgets/DateWheel');

    // create the main context
    var mainContext = Engine.createContext();

    // create the date/picker
    var dateWheel = new DateWheel({
        date: new Date(),
        wheelOptions: {
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
            /*new DateWheel.Component.Month({
                format: function(date) {
                    return moment(date).format('MMM');
                }
            }),*/
            //new DatePicker.Component.WeekDay(),
            //new DateWheel.Component.Day(),
            new DateWheel.Component.Hour(),
            new DateWheel.Component.Minute()
            //new DateWheel.Component.Second()
        ]
    });
    mainContext.add(dateWheel);

    //
    // Log events
    //
    function formatDate(date) {
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
    });

    //
    // Update with current time
    //
    /*Timer.setInterval(function() {
        dateWheel.setDate(new Date());
    }, 1000);*/
});
