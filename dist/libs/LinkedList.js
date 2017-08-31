"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function createNode(item) {
  return {
    _next: null,
    _prev: null,
    item
  };
}

var LinkedList =
/*#__PURE__*/
function () {
  function LinkedList() {
    _classCallCheck(this, LinkedList);

    this._length = 0;
    this._front = null;
    this._end = null;
  }

  _createClass(LinkedList, [{
    key: "empty",
    value: function empty() {
      this._length = 0;
      this._front = null;
      this._end = null;
    }
  }, {
    key: "push",
    value: function push() {
      var _this = this;

      for (var _len = arguments.length, items = new Array(_len), _key = 0; _key < _len; _key++) {
        items[_key] = arguments[_key];
      }

      items.forEach(function (item) {
        var node = createNode(item);

        if (_this._front && _this._end) {
          _this._end._next = node;
          node._prev = _this._end;
          _this._end = node;
        } else {
          _this._front = node;
          _this._end = node;
        }

        _this._length++;
      });
      return this._length;
    }
  }, {
    key: "shift",
    value: function shift() {
      var item = this._front;

      if (item === null) {
        return null;
      }

      if (item._next != null) {
        this._front = item._next;
        this._front._prev = null;
      } else {
        this._front = null;
        this._end = null;
      }

      item._next = null;
      this._length--;
      return item.item;
    }
  }, {
    key: "unshift",
    value: function unshift() {
      var _this2 = this;

      for (var _len2 = arguments.length, items = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        items[_key2] = arguments[_key2];
      }

      items.forEach(function (item) {
        var node = createNode(item);

        if (_this2._front === null) {
          _this2._front = node;
          _this2._end = node;
        } else {
          node._next = _this2._front;
          _this2._front._prev = node;
          _this2._front = node;
        }

        _this2._length++;
      });
      return this._length;
    }
  }, {
    key: "pop",
    value: function pop() {
      var item = this._end;

      if (item === null) {
        return null;
      }

      if (item._prev != null) {
        this._end = item._prev;
        this._end._next = null;
      } else {
        this._front = null;
        this._end = null;
      }

      this._length--;
      item._prev = null;
      return item.item;
    }
  }, {
    key: "length",
    get: function get() {
      return this._length;
    }
  }]);

  return LinkedList;
}();

if (Symbol.iterator) {
  LinkedList.prototype[Symbol.iterator] = function () {
    var node = this._front;
    return {
      next() {
        if (node === null) {
          return {
            value: null,
            done: true
          };
        }

        var r = {
          value: node.item,
          done: false
        };
        node = node._next;
        return r;
      }

    };
  };
}

module.exports = LinkedList;