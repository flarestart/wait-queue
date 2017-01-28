/*
 * Javascript WaitQueue Object in ES5
 * https://github.com/flarestart/wait-queue-es5
 */
'use strict';

function LinkList() {
    this.length = 0;
    this._front = null;
    this._end = null;
}
LinkList.prototype.push = function (item) {
    var node = {
        item: item,
        _next: null,
        _prev: null
    };
    if (this.length <= 0) {
        this._front = node;
        this._end = node;
    } else {
        this._end._next = node;
        node._prev = this._end;
        this._end = node;
    }
    this.length++;
};
LinkList.prototype.shift = function () {
    var item = this._front;
    if (item === null) {
        return null;
    }
    if (this._front._next != null) {
        this._front = this._front._next;
        this._front._prev = null;
    } else {
        this._front = null;
        this._end = null;
    }
    item._next = undefined;
    this.length--;
    return item.item;
};
LinkList.prototype.unshift = function (item) {
    var node = {
        item: item,
        _next: null,
        _prev: null
    };
    if (this.length <= 0) {
        this._front = node;
        this._end = node;
    } else {
        node._next = this._front;
        this._front._prev = node;
        this._front = node;
    }
    this.length++;
};
LinkList.prototype.pop = function () {
    var item = this._end;
    if (item === null) {
        return null;
    }
    if (this._end._prev != null) {
        this._end = this._end._prev;
        this._end._next = null;
    } else {
        this._front = null;
        this._end = null;
    }
    this.length--;
    item._prev = undefined;
    return item.item;
};

module.exports = LinkList;