/*
 * Javascript WaitQueue Object in ES5
 * https://github.com/flarestart/wait-queue-es5
 */
'use strict'

class Node{
    constructor(item){
        this.item = item
        this._next = null
        this._prev = null
    }
}

class LinkList {
    constructor() {
        this._length = 0
        this._front = null
        this._end = null
    }
    get length(){
        return this._length
    }
    [Symbol.iterator]() {
        var node = this._front
        return {
            next() {
                if (node === null) {
                    return { done: true }
                } else {
                    let r = { value: node.item, done: false}
                    node = node._next
                    return r
                }
            }
        }
    }
    empty(){
        this._length = 0
        this._front = null
        this._end = null
    }
    push() {
        for(var n=0; n<arguments.length; n++){
            var item = arguments[n]
            var node = new Node(item)
            if (this._length <= 0) {
                this._front = node
                this._end = node
            } else {
                this._end._next = node
                node._prev = this._end
                this._end = node
            }
            this._length++
        }
        return this._length
    }
    shift() {
        var item = this._front
        if (item === null) {
            return null
        }
        if (this._front._next != null) {
            this._front = this._front._next
            this._front._prev = null
        } else {
            this._front = null
            this._end = null
        }
        item._next = undefined
        this._length--
        return item.item
    }
    unshift() {
        for(var n=0; n<arguments.length; n++){
            var item = arguments[n]
            var node = new Node(item)
            if (this._length <= 0) {
                this._front = node
                this._end = node
            } else {
                node._next = this._front
                this._front._prev = node
                this._front = node
            }
            this._length++
        }
        return this._length
    }
    pop() {
        var item = this._end
        if (item === null) {
            return null
        }
        if (this._end._prev != null) {
            this._end = this._end._prev
            this._end._next = null
        } else {
            this._front = null
            this._end = null
        }
        this._length--
        item._prev = undefined
        return item.item
    }
}

module.exports = LinkList