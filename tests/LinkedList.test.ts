import * as assert from 'assert';
import LinkedList from '../src/libs/LinkedList';

describe('LinkedList', function() {
  const ll = new LinkedList();
  beforeEach(function() {
    // clear waitqueue
    ll.empty();
  });
  it('length should equal to 10', function() {
    for (let n = 0; n < 10; n++) {
      ll.push(n);
    }
    assert.deepStrictEqual(10, ll.length);
  });
  it('set length will throw an error in strict mode', function() {
    assert.throws(function() {
      'use strict';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const obj: any = ll;
      obj.length = 10;
    }, /Cannot set property/);
  });
  it('empty()', function() {
    ll.push(1);
    ll.empty();
    assert.strictEqual(null, ll._front);
    assert.strictEqual(null, ll._end);
    assert.strictEqual(0, ll.length);
  });
  it('push 10 times', function() {
    for (let n = 0; n < 10; n++) {
      ll.push(n);
    }
    assert.deepStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], Array.from(ll));
  });
  it('push() should be sequence', function() {
    for (let n = 0; n < 5; n++) {
      ll.push(n);
    }
    assert.deepStrictEqual([0, 1, 2, 3, 4], Array.from(ll));
  });
  it('push() can receive multi args', function() {
    ll.push(0, 1, 2, 3, 4);
    assert.deepStrictEqual([0, 1, 2, 3, 4], Array.from(ll));
  });
  it('unshift() should return queue length', function() {
    assert.strictEqual(1, ll.unshift(1));
  });
  it('unshift() should be reverse', function() {
    for (let n = 0; n < 5; n++) {
      ll.unshift(n);
    }
    assert.deepStrictEqual([4, 3, 2, 1, 0], Array.from(ll));
  });
  it('unshift() can receive multi args', function() {
    ll.unshift(0, 1, 2, 3, 4);
    assert.deepStrictEqual([4, 3, 2, 1, 0], Array.from(ll));
  });

  it('shift() should return null', function() {
    const ret = ll.shift();
    assert.equal(ret, null);
  });

  it('pop() should return null', function() {
    const ret = ll.pop();
    assert.equal(ret, null);
  });

  it('shift() should return null', function() {
    ll.push('step1');
    ll.push('step2');
    const ret = ll.shift();
    assert.equal(ret, 'step1');
  });

  it('pop() should return null', function() {
    ll.push('step1');
    ll.push('step2');
    const ret = ll.pop();
    assert.equal(ret, 'step2');
  });

  it('Iterator for(... of ...)', function() {
    for (let n = 0; n < 5; n++) {
      ll.push(n);
    }
    const arr = [];
    for (const n of ll) {
      arr.push(n);
    }
    assert.deepStrictEqual([0, 1, 2, 3, 4], arr);
  });
});
