/**
 * This Source Code is licensed under the MIT license. If a copy of the
 * MIT-license was not distributed with this file, You can obtain one at:
 * http://opensource.org/licenses/mit-license.html.
 *
 * @author: Hein Rutjes (IjzerenHein)
 * @license MIT
 * @copyright Gloey Apps, 2014
 */

/*global define, console*/
/*eslint no-use-before-define:0, no-console:0 */

/**
 * Date/time picker-wheel components (minute, seconds, full-day, month, etc...).
 *
 * @module
 */
define(function(require, exports, module) {

    var Surface = require('famous/core/Surface');

        /*function getNextMonth(date, prev) {
        if (prev) {
            if (date.getMonth() === 11) {
                return new Date(date.getFullYear() + 1, 0, 1);
            }
            else {
                return new Date(date.getFullYear(), date.getMonth() + 1, 1);
            }
        }
        else {
            if (date.getMonth() === 0) {
                return new Date(date.getFullYear() - 1, 11, 1);
            }
            else {
                return new Date(date.getFullYear(), date.getMonth() - 1, 1);
            }
        }
    }*/

    /**
     * Helper function for formatting a value with a least 2 decimal places.
     */
    function decimal2(renderable) {
        return ('0' + renderable.date[this.get]()).slice(-2);
    }
    function decimal3(renderable) {
        return ('00' + renderable.date[this.get]()).slice(-3);
    }
    function decimal4(renderable) {
        return ('000' + renderable.date[this.get]()).slice(-4);
    }

    /**
     * Base component class
     */
    function Base() {
    }
    Base.prototype.step = 1;
    Base.prototype.getComponent = function(date) {
        return date[this.get]();
    };
    Base.prototype.setComponent = function(date, value) {
        return date[this.set](value);
    };
    Base.prototype.format = function(renderable) {
        return 'overide to implement';
    };
    Base.prototype.getNext = function(renderable) {
        var date = new Date(renderable.date.getTime());
        var newVal = this.getComponent(date) + this.step;
        if ((this.max !== undefined) && (newVal > this.max)) {
            if (!this.loop) {
                return undefined;
            }
            newVal = newVal % (this.max + 1);
        }
        this.setComponent(date, newVal);
        return this.create(date);
    };
    Base.prototype.getPrevious = function(renderable) {
        var date = new Date(renderable.date.getTime());
        var newVal = this.getComponent(date) - this.step;
        if ((this.min !== undefined) && (newVal < newVal)) {
            if (!this.loop) {
                return undefined;
            }
            newVal = newVal % (this.max + 1);
        }
        this.setComponent(date, newVal);
        return this.create(date);
    };
    Base.prototype.create = function(date) {
        var surface = new Surface({
            classes: ['famous-flex-datepicker-item']
        });
        surface.date = date || new Date();
        surface.setContent('<div>' + this.format(surface) + '</div>');
        return surface;
    };

    /**
     * Full-day component
     */
    function FullDay() {
        Base.apply(this, arguments);
    }
    FullDay.prototype = Object.create(Base.prototype);
    FullDay.prototype.constructor = FullDay;
    FullDay.prototype.sizeRatio = 2;
    FullDay.prototype.step = 1;
    FullDay.prototype.set = 'setDate';
    FullDay.prototype.get = 'getDate';
    FullDay.prototype.format = function(renderable) {
        return renderable.date.toLocaleDateString();
    };

    /**
     * Week-day component
     */
    function WeekDay() {
        Base.apply(this, arguments);
    }
    WeekDay.prototype = Object.create(Base.prototype);
    WeekDay.prototype.constructor = WeekDay;
    WeekDay.prototype.sizeRatio = 2;
    WeekDay.prototype.min = 0;
    WeekDay.prototype.max = 6;
    WeekDay.prototype.step = 1;
    WeekDay.prototype.loop = true;
    WeekDay.prototype.set = 'setDate';
    WeekDay.prototype.get = 'getDate';
    WeekDay.prototype.strings = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday'
    ];
    WeekDay.prototype.format = function(renderable) {
        return this.strings[renderable.date.getDay()];
    };

    /**
     * Month component
     */
    function Month() {
        Base.apply(this, arguments);
    }
    Month.prototype = Object.create(Base.prototype);
    Month.prototype.constructor = Month;
    Month.prototype.sizeRatio = 2;
    Month.prototype.min = 0;
    Month.prototype.max = 11;
    Month.prototype.step = 1;
    Month.prototype.loop = true;
    Month.prototype.set = 'setMonth';
    Month.prototype.get = 'getMonth';
    Month.prototype.strings = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    Month.prototype.format = function(renderable) {
        return this.strings[renderable.date.getMonth()];
    };

    /**
     * Year component
     */
    function Year() {
        Base.apply(this, arguments);
    }
    Year.prototype = Object.create(Base.prototype);
    Year.prototype.constructor = Year;
    Year.prototype.format = decimal4;
    Year.prototype.sizeRatio = 1;
    Year.prototype.step = 1;
    Year.prototype.loop = false;
    Year.prototype.set = 'setFullYear';
    Year.prototype.get = 'getFullYear';

    /**
     * Hour component
     */
    function Hour() {
        Base.apply(this, arguments);
    }
    Hour.prototype = Object.create(Base.prototype);
    Hour.prototype.constructor = Hour;
    Hour.prototype.format = decimal2;
    Hour.prototype.sizeRatio = 1;
    Hour.prototype.min = 0;
    Hour.prototype.max = 59;
    Hour.prototype.step = 1;
    Hour.prototype.loop = true;
    Hour.prototype.set = 'setHours';
    Hour.prototype.get = 'getHours';

    /**
     * Minute component
     */
    function Minute() {
        Base.apply(this, arguments);
    }
    Minute.prototype = Object.create(Base.prototype);
    Minute.prototype.constructor = Minute;
    Minute.prototype.format = decimal2;
    Minute.prototype.sizeRatio = 1;
    Minute.prototype.min = 0;
    Minute.prototype.max = 59;
    Minute.prototype.step = 1;
    Minute.prototype.loop = true;
    Minute.prototype.set = 'setMinutes';
    Minute.prototype.get = 'getMinutes';

    /**
     * Second component
     */
    function Second() {
        Base.apply(this, arguments);
    }
    Second.prototype = Object.create(Base.prototype);
    Second.prototype.constructor = Second;
    Second.prototype.format = decimal2;
    Second.prototype.sizeRatio = 1;
    Second.prototype.min = 0;
    Second.prototype.max = 59;
    Second.prototype.step = 1;
    Second.prototype.loop = true;
    Second.prototype.set = 'setSeconds';
    Second.prototype.get = 'getSeconds';

    /**
     * Millisecond component
     */
    function Millisecond() {
        Base.apply(this, arguments);
    }
    Millisecond.prototype = Object.create(Base.prototype);
    Millisecond.prototype.constructor = Millisecond;
    Millisecond.prototype.format = decimal3;
    Millisecond.prototype.sizeRatio = 1;
    Millisecond.prototype.min = 0;
    Millisecond.prototype.max = 999;
    Millisecond.prototype.step = 1;
    Millisecond.prototype.loop = true;
    Millisecond.prototype.set = 'setMilliseconds';
    Millisecond.prototype.get = 'getMilliseconds';

    return {
        Base: Base,
        Year: Year,
        Month: Month,
        FullDay: FullDay,
        WeekDay: WeekDay,
        Hour: Hour,
        Minute: Minute,
        Second: Second,
        Millisecond: Millisecond,
        formatters: {
            decimal2: decimal2,
            decimal3: decimal3,
            decimal4: decimal4
        }
    };
});
