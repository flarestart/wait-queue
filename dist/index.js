"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
/*
 * Javascript WaitQueue Object
 * https://github.com/flarestart/wait-queue
 */
var LinkedList_1 = __importDefault(require("./libs/LinkedList"));
var WaitQueue = /** @class */ (function () {
    function WaitQueue() {
        this.queue = new LinkedList_1.default();
        this.listeners = new LinkedList_1.default();
    }
    Object.defineProperty(WaitQueue.prototype, "length", {
        get: function () {
            return this.queue.length;
        },
        enumerable: false,
        configurable: true
    });
    WaitQueue.prototype.numWaiters = function () {
        return this.listeners.length;
    };
    WaitQueue.prototype.empty = function () {
        this.queue = new LinkedList_1.default();
    };
    WaitQueue.prototype.clear = function () {
        this.queue = new LinkedList_1.default();
    };
    WaitQueue.prototype.clearListeners = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.listeners), _c = _b.next(); !_c.done; _c = _b.next()) {
                var listener = _c.value;
                listener(new Error('Clear Listeners'));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.listeners = new LinkedList_1.default();
    };
    WaitQueue.prototype.unshift = function (item) {
        this.queue.unshift(item);
        this._flush();
        return this.length;
    };
    WaitQueue.prototype.push = function (item) {
        this.queue.push(item);
        this._flush();
        return this.length;
    };
    WaitQueue.prototype._remove = function (type, timeout) {
        var _this = this;
        var fn;
        switch (type) {
            case 'SHIFT':
                fn = this.queue.shift.bind(this.queue);
                break;
            case 'POP':
                fn = this.queue.pop.bind(this.queue);
                break;
        }
        return new Promise(function (resolve, reject) {
            var self = _this;
            if (self.queue.length > 0) {
                return resolve(fn());
            }
            else {
                var timerId_1;
                var listener_1 = self.listeners.push(function (err) {
                    if (timerId_1) {
                        clearTimeout(timerId_1);
                        timerId_1 = undefined;
                    }
                    if (err) {
                        return reject(err);
                    }
                    return resolve(fn());
                });
                timerId_1 = (timeout && timeout > 0) ?
                    setTimeout(function () {
                        timerId_1 = undefined;
                        self.listeners.remove(listener_1);
                        reject(new Error("Timed Out"));
                    }, timeout) : undefined;
            }
        });
    };
    WaitQueue.prototype.shift = function (timeout) {
        return this._remove('SHIFT', timeout);
    };
    WaitQueue.prototype.pop = function (timeout) {
        return this._remove('POP', timeout);
    };
    WaitQueue.prototype._flush = function () {
        while (this.queue.length > 0 && this.listeners.length > 0) {
            var listener = this.listeners.shift();
            listener.call(this);
        }
    };
    return WaitQueue;
}());
if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    WaitQueue.prototype[Symbol.iterator] = function () {
        return this.queue[Symbol.iterator]();
    };
}
module.exports = WaitQueue;
