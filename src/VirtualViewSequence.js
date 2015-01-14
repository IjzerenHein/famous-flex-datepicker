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

/**
 * Virtual ViewSequence for famo.us which creates & destroys nodes using a
 * factory which can produce renderables. The factory class should support
 * the following functions:
 * - create()
 * - createNext(prevRenderable)
 * - createPrevious(nextRenderable)
 * - destroy(renderable)
 *
 * VirtualViewSequence implements the following methods:
 * - getPrevious
 * - getNext
 * - get
 * - getIndex
 * - toString (returns the index)
 *
 * @module
 */
define(function(require, exports, module) {

    // import dependencies
    var EventHandler = require('famous/core/EventHandler');

    /**
     * @class
     * @alias module:VirtualViewSequence
     */
    function VirtualViewSequence(options) {
        options = options || {};
        this._ = options._ || new (this.constructor.Backing)(options);
        this.touched = true;
        this.value = options.value || this._.factory.create();
        this.index = options.index || 0;
        this.next = options.next;
        this.prev = options.prev;
        EventHandler.setOutputHandler(this, this._.eventOutput);
        this.value.pipe(this._.eventOutput);
    }

    VirtualViewSequence.Backing = function Backing(options) {
        this.factory = options.factory;
        this.eventOutput = new EventHandler();
    };

    /**
     * Cleans up any untouched nodes.
     *
     * @return {VirtualViewSequence} previous node.
     */
    VirtualViewSequence.prototype.cleanup = function() {
        var node = this.prev;
        while (node) {
            if (!node.touched) {
                node.next.prev = undefined;
                node.next = undefined;
                if (this._.factory.destroy) {
                    while (node) {
                        this._.factory.destroy(node.value);
                        node = node.prev;
                    }
                }
                break;
            }
            node.touched = false;
            node = node.prev;
        }
        node = this.next;
        while (node) {
            if (!node.touched) {
                node.prev.next = undefined;
                node.prev = undefined;
                if (this._.factory.destroy) {
                    while (node) {
                        this._.factory.destroy(node.value);
                        node = node.next;
                    }
                }
                break;
            }
            node.touched = false;
            node = node.next;
        }
        return this;
    };

    /**
     * Get previous node.
     *
     * @return {VirtualViewSequence} previous node.
     */
    VirtualViewSequence.prototype.getPrevious = function() {
        if (this.prev) {
            this.prev.touched = true;
            return this.prev;
        }
        var value = this._.factory.createPrevious(this.get());
        if (!value) {
            return undefined;
        }
        //console.log('creating new prev node');
        this.prev = new VirtualViewSequence({
            _: this._,
            value: value,
            index: this.index - 1,
            next: this
        });
        return this.prev;
    };

    /**
     * Get next node.
     *
     * @return {VirtualViewSequence} node.
     */
    VirtualViewSequence.prototype.getNext = function() {
        if (this.next) {
            this.next.touched = true;
            return this.next;
        }
        var value = this._.factory.createNext(this.get());
        if (!value) {
            return undefined;
        }
        //console.log('creating new next node');
        this.next = new VirtualViewSequence({
            _: this._,
            value: value,
            index: this.index + 1,
            prev: this
        });
        return this.next;
    };

    /**
     * Get the value of this node.
     *
     * @return {Renderable} surface/view
     */
    VirtualViewSequence.prototype.get = function() {
        this.touched = true;
        return this.value;
    };

    /**
     * Get the index of the node.
     *
     * @return {Number} Index of node.
     */
    VirtualViewSequence.prototype.getIndex = function() {
        this.touched = true;
        return this.index;
    };

    /**
     * Get human readable string verion of the node.
     *
     * @return {String} node as a human readable string
     */
    VirtualViewSequence.prototype.toString = function() {
        return '' + this.index;
    };

    /**
     * Not supported
     */
    VirtualViewSequence.prototype.unshift = function() {
        if (console.error) {
            console.error('VirtualViewSequence.unshift is not supported and should not be called');
        }
    };

    /**
     * Not supported
     */
    VirtualViewSequence.prototype.push = function() {
        if (console.error) {
            console.error('VirtualViewSequence.push is not supported and should not be called');
        }
    };

    /**
     * Not supported
     */
    VirtualViewSequence.prototype.splice = function() {
        if (console.error) {
            console.error('VirtualViewSequence.splice is not supported and should not be called');
        }
    };

    /**
     * Not supported
     */
    VirtualViewSequence.prototype.swap = function() {
        if (console.error) {
            console.error('VirtualViewSequence.swap is not supported and should not be called');
        }
    };

    module.exports = VirtualViewSequence;
});
