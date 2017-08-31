"use strict";
/*
 * Javascript WaitQueue Object
 * https://github.com/flarestart/wait-queue
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var LinkedList = require('./libs/LinkedList');

var nextTick = function () {
  if (typeof process === 'object' && process.nextTick) {
    return process.nextTick;
  }

  if (typeof setImmediate === 'function') {
    return setImmediate;
  }

  return setTimeout;
}();

var WaitQueue =
/*#__PURE__*/
function () {
  function WaitQueue() {
    _classCallCheck(this, WaitQueue);

    this.queue = new LinkedList();
    this.listeners = new LinkedList();
  }

  _createClass(WaitQueue, [{
    key: "empty",
    value: function empty() {
      this.queue = new LinkedList();
    }
  }, {
    key: "clear",
    value: function clear() {
      this.queue = new LinkedList();
    }
  }, {
    key: "clearListeners",
    value: function clearListeners() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var listener = _step.value;
          listener(new Error('Clear Listeners'));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.listeners = new LinkedList();
    }
  }, {
    key: "unshift",
    value: function unshift() {
      var _this$queue;

      (_this$queue = this.queue).unshift.apply(_this$queue, arguments);

      this._flush();

      return this.length;
    }
  }, {
    key: "push",
    value: function push() {
      var _this$queue2;

      (_this$queue2 = this.queue).push.apply(_this$queue2, arguments);

      this._flush();

      return this.length;
    }
  }, {
    key: "shift",
    value: function shift() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        if (_this.queue.length > 0) {
          return resolve(_this.queue.shift());
        } else {
          _this.listeners.push(function (err) {
            if (err) {
              return reject(err);
            }

            return resolve(_this.queue.shift());
          });
        }
      });
    }
  }, {
    key: "pop",
    value: function pop() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        if (_this2.queue.length > 0) {
          return resolve(_this2.queue.pop());
        } else {
          _this2.listeners.push(function (err) {
            if (err) {
              return reject(err);
            }

            return resolve(_this2.queue.pop());
          });
        }
      });
    }
  }, {
    key: "_flush",
    value: function _flush() {
      if (this.queue.length > 0 && this.listeners.length > 0) {
        var listener = this.listeners.shift();
        listener.call(this); // delay next loop

        nextTick(this._flush.bind(this));
      }
    }
  }, {
    key: "length",
    get: function get() {
      return this.queue.length;
    }
  }]);

  return WaitQueue;
}();

if (typeof Symbol !== 'undefined') {
  WaitQueue.prototype[Symbol.iterator] = function () {
    var node = this.queue._front;
    return {
      next() {
        if (node === null) {
          return {
            value: null,
            done: true
          };
        } else {
          var r = {
            value: node.item,
            done: false
          };
          node = node._next;
          return r;
        }
      }

    };
  };
}

module.exports = WaitQueue;