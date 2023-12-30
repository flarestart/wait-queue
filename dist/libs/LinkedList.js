"use strict";
/*
 * Javascript WaitQueue Object in ES5
 * https://github.com/flarestart/wait-queue-es5
 */
Object.defineProperty(exports, "__esModule", { value: true });
function createNode(item) {
    var tmp = {
        _next: null,
        _prev: null,
        item: item
    };
    tmp._next = tmp;
    tmp._prev = tmp;
    return tmp;
}
var LinkedList = /** @class */ (function () {
    /* same as empty */
    function LinkedList() {
        this._length = 0;
        this._head = createNode();
        this._length = 0;
    }
    /* same as constructor */
    LinkedList.prototype.empty = function () {
        this._head = createNode();
        this._length = 0;
    };
    Object.defineProperty(LinkedList.prototype, "length", {
        get: function () {
            return this._length;
        },
        enumerable: false,
        configurable: true
    });
    LinkedList.prototype.push = function (item) {
        var node = createNode(item);
        node._next = this._head;
        node._prev = this._head._prev;
        this._head._prev._next = node;
        this._head._prev = node;
        if (this._head._next == this._head) {
            this._head._next = node;
        }
        this._length++;
        return node;
    };
    LinkedList.prototype.unshift = function (item) {
        var node = createNode(item);
        node._prev = this._head;
        node._next = this._head._next;
        this._head._next._prev = node;
        this._head._next = node;
        if (this._head._prev == this._head) {
            this._head._prev = node;
        }
        this._length++;
        return node;
    };
    LinkedList.prototype.pop = function () {
        if (this._head._prev == this._head) {
            throw new Error("empty list");
        }
        var item = this._head._prev;
        this._head._prev = item._prev;
        item._prev._next = this._head;
        item._removed = true;
        this._length--;
        return item.item;
    };
    LinkedList.prototype.shift = function () {
        if (this._head._next == this._head) {
            throw new Error("empty list");
        }
        var item = this._head._next;
        this._head._next = item._next;
        item._next._prev = this._head;
        item._removed = true;
        this._length--;
        return item.item;
    };
    LinkedList.prototype.remove = function (node) {
        if (node._removed) {
            return;
        }
        node._prev._next = node._next;
        node._next._prev = node._prev;
        node._removed = true;
        this._length--;
    };
    return LinkedList;
}());
/* istanbul ignore next */
if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    LinkedList.prototype[Symbol.iterator] = function () {
        var head = this._head;
        var node = this._head._next;
        return {
            next: function () {
                if (node === head) {
                    return { value: null, done: true };
                }
                var r = { value: node.item, done: false };
                node = node._next;
                return r;
            }
        };
    };
}
exports.default = LinkedList;
