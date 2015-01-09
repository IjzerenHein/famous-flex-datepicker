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
 * Infinite InfiniteViewSequence for famo.us which implements the following methods:
 * - getPrevious
 * - getNext
 * - get
 * - getIndex
 * - toString
 *
 * @module
 */
define(function(require, exports, module) {

    // import dependencies
    var EventHandler = require('famous/core/EventHandler');

    /**
     * @class
     * @alias module:InfiniteViewSequence
     */
    function InfiniteViewSequence(options) {
        options = options || {};
        this._ = options._ || new (this.constructor.Backing)(options);
        this.value = options.value || this._.delegate.create();
        this.index = options.index || 0;
        EventHandler.setOutputHandler(this, this._.eventOutput);
        this.value.pipe(this._.eventOutput);
    }

    InfiniteViewSequence.Backing = function Backing(options) {
        this.delegate = options.delegate;
        this.eventOutput = new EventHandler();
    };

    /**
     * Get previous node.
     *
     * @return {InfiniteViewSequence} previous node.
     */
    InfiniteViewSequence.prototype.getPrevious = function() {
        if (this.prev) {
            return this.prev;
        }
        var value = this._.delegate.getPrevious(this.get());
        if (!value) {
            return undefined;
        }
        this.prev = new InfiniteViewSequence({
            _: this._,
            value: value,
            index: this.index - 1
        });
        return this.prev;
    };

    /**
     * Get next node.
     *
     * @return {InfiniteViewSequence} node.
     */
    InfiniteViewSequence.prototype.getNext = function() {
        if (this.next) {
            return this.next;
        }
        var value = this._.delegate.getNext(this.get());
        if (!value) {
            return undefined;
        }
        this.next = new InfiniteViewSequence({
            _: this._,
            value: value,
            index: this.index + 1
        });
        return this.next;
    };

    /**
     * Get the value of this node.
     *
     * @return {Renderable} surface/view
     */
    InfiniteViewSequence.prototype.get = function() {
        return this.value;
    };

    /**
     * Get the index of the node.
     *
     * @return {Number} Index of node.
     */
    InfiniteViewSequence.prototype.getIndex = function() {
        return this.index;
    };

    /**
     * Get human readable string verion of the node.
     *
     * @return {String} node as a human readable string
     */
    InfiniteViewSequence.prototype.toString = function() {
        return this._.delegate.format(this.value);
    };

    /**
     * Not supported
     */
    InfiniteViewSequence.prototype.unshift = function() {
        if (console.error) {
            console.error('InfiniteViewSequence.unshift is not supported and should not be called');
        }
    };

    /**
     * Not supported
     */
    InfiniteViewSequence.prototype.push = function() {
        if (console.error) {
            console.error('InfiniteViewSequence.push is not supported and should not be called');
        }
    };

    /**
     * Not supported
     */
    InfiniteViewSequence.prototype.splice = function() {
        if (console.error) {
            console.error('InfiniteViewSequence.splice is not supported and should not be called');
        }
    };

    /**
     * Not supported
     */
    InfiniteViewSequence.prototype.swap = function() {
        if (console.error) {
            console.error('InfiniteViewSequence.swap is not supported and should not be called');
        }
    };

    module.exports = InfiniteViewSequence;
});
