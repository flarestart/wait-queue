var assert = require('assert');
var WaitQueue = require('../dist/index');
describe('Methods of WaitQueue', function() {
  var wq = new WaitQueue();
  beforeEach(function() {
    // clear waitqueue
    wq.clear();
    wq.clearListeners();
  });
  it('length is equal to 10', function() {
    for (var n = 0; n < 10; n++) {
      wq.push(n);
    }
    assert.deepStrictEqual(10, wq.length);
  });
  it('length is readonly', function() {
    wq.length = 10;
    assert.deepStrictEqual(0, wq.length);
  });
  it('set length will throw an error in strict mode', function() {
    assert.throws(function() {
      'use strict';
      wq.length = 10;
    }, /Cannot set property/);
  });
  it('empty()', function() {
    wq.push(1);
    wq.empty();
    assert.deepStrictEqual([], Array.from(wq));
  });
  it('clearListeners() will send error to wait listeners', function(done) {
    var w = new WaitQueue();
    var num = 0;
    var handler = function(e) {
      assert.throws(function() {
        throw e;
      }, '/Clear Listeners');
      num++;
      if (num >= 2) {
        done();
      }
    };
    w.shift().catch(handler);
    w.shift().catch(handler);
    w.clearListeners();
  });
  it('push() should return queue length', function() {
    assert.strictEqual(1, wq.push(1));
  });
  it('push() should be sequence', function() {
    for (var n = 0; n < 5; n++) {
      wq.push(n);
    }
    assert.deepStrictEqual([0, 1, 2, 3, 4], Array.from(wq));
  });
  it('push() can receive multi args', function() {
    wq.push(0, 1, 2, 3, 4);
    assert.deepStrictEqual([0, 1, 2, 3, 4], Array.from(wq));
  });
  it('unshift() should return queue length', function() {
    assert.strictEqual(1, wq.unshift(1));
  });
  it('unshift() should be reverse', function() {
    for (var n = 0; n < 5; n++) {
      wq.unshift(n);
    }
    assert.deepStrictEqual([4, 3, 2, 1, 0], Array.from(wq));
  });
  it('unshift() can receive multi args', function() {
    wq.unshift(0, 1, 2, 3, 4);
    assert.deepStrictEqual([4, 3, 2, 1, 0], Array.from(wq));
  });
  it('shift() should return a promise', function() {
    wq.push(1);
    assert.ok(wq.shift() instanceof Promise);
  });
  it('pop() should return a promise', function() {
    wq.push(1);
    assert.ok(wq.pop() instanceof Promise);
  });
  it('shift() should wait while empty', function(done) {
    var value = {};
    var w = new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(value);
      }, 1000);
    });
    Promise.race([w, wq.shift()])
      .then(function(r) {
        assert.strictEqual(value, r);
        done();
      })
      .catch(function(e) {
        done(e);
      });
  });

  it('pop() should wait while empty', function(done) {
    var value = {};
    var w = new Promise(function(resolve, reject) {
      setTimeout(function() {
        resolve(value);
      }, 1000);
    });
    Promise.race([w, wq.shift()])
      .then(function(r) {
        assert.strictEqual(value, r);
        done();
      })
      .catch(function(e) {
        done(e);
      });
  });
  it('Iterator for(... of ...)', function() {
    for (var n = 0; n < 5; n++) {
      wq.push(n);
    }
    var arr = [];
    for (var n of wq) {
      arr.push(n);
    }
    assert.deepStrictEqual([0, 1, 2, 3, 4], arr);
  });
});
