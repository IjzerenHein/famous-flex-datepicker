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
 * Date/time picker-wheel for famo.us.
 *
 * @module
 */
define(function(require, exports, module) {

    // import dependencies
    var View = require('famous/core/View');
    var ScrollController = require('famous-flex/ScrollController');
    var WheelLayout = require('famous-flex/layouts/WheelLayout');

    /**
     * @class
     * @extends View
     * @param {Object} options Configurable options.
     * @alias module:DatePicker
     */
    function DatePicker(options) {
        View.apply(this, arguments);

    }
    DatePicker.prototype = Object.create(View.prototype);
    DatePicker.prototype.constructor = DatePicker;

    DatePicker.DEFAULT_OPTIONS = {
    };

    module.exports = DatePicker;
});
