var assert = require('assert')
var LinkList = require('../libs/LinkList')
describe('LinkList', function () {
    var ll = new LinkList()
    beforeEach(function () {
        // clear waitqueue
        ll.empty()
    })
    it('length should equal to 10', function () {
        for (var n = 0; n < 10; n++) {
            ll.push(n)
        }
        assert.deepStrictEqual(10, ll.length)
    })
    it('length is readonly', function () {
        ll.length == 10
        assert.deepStrictEqual(0, ll.length)
    })
    it('set length will throw an error in strict mode', function () {
        assert.throws(function () {
            'use strict'
            ll.length = 10
        }, /Cannot set property/)
    })
    it('empty()', function () {
        ll.push(1)
        ll.empty()
        assert.strictEqual(null, ll._front)
        assert.strictEqual(null, ll._end)
        assert.strictEqual(0, ll.length)
    })
    it('push 10 times', function () {
        for (var n = 0; n < 10; n++) {
            ll.push(n)
        }
        assert.deepStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], Array.from(ll))
    })
    it('push() should be sequence', function () {
        for (var n = 0; n < 5; n++) {
            ll.push(n)
        }
        assert.deepStrictEqual([0, 1, 2, 3, 4], Array.from(ll))
    })
    it('push() can receive multi args', function () {
        ll.push(0, 1, 2, 3, 4)
        assert.deepStrictEqual([0, 1, 2, 3, 4], Array.from(ll))
    })
    it('unshift() should return queue length', function () {
        assert.strictEqual(1, ll.unshift(1))
    })
    it('unshift() should be reverse', function () {
        for (var n = 0; n < 5; n++) {
            ll.unshift(n)
        }
        assert.deepStrictEqual([4, 3, 2, 1, 0], Array.from(ll))
    })
    it('unshift() can receive multi args', function () {
        ll.unshift(0, 1, 2, 3, 4)
        assert.deepStrictEqual([4, 3, 2, 1, 0], Array.from(ll))
    })
    it('Iterator for(... of ...)', function () {
        for (var n = 0; n < 5; n++) {
            ll.push(n)
        }
        var arr = []
        for (var n of ll) {
            arr.push(n)
        }
        assert.deepStrictEqual([0, 1, 2, 3, 4], arr)
    })
})
