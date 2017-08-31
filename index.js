/*
 * Javascript WaitQueue Object
 * https://github.com/flarestart/wait-queue
 */
'use strict'
const LinkList = require('./libs/LinkList')

class WaitQueue {
	constructor() {
		this.queue = new LinkList
		this.listeners = new LinkList
	}
	[Symbol.iterator]() {
		var node = this.queue._front
		return {
			next() {
				if (node === null) {
					return { done: true }
				} else {
					let r = { value: node.item, done: false }
					node = node._next
					return r
				}
			}
		}
	}
	_flush() {
		if (this.queue.length > 0 && this.listeners.length > 0) {
			let listener = this.listeners.shift()
			listener.call(this)
			// delay next loop
			setImmediate(this._flush.bind(this))
		}
	}
	get length() {
		return this.queue.length
	}
	empty() {
		this.queue = new LinkList
	}
	clear() {
		this.queue = new LinkList
	}
	clearListeners() {
		for (let listener of this.listeners) {
			listener(new Error('Clear Listeners'))
		}
		this.listeners = new LinkList
	}
	unshift(item) {
		this.queue.unshift.apply(this.queue, arguments)
		this._flush()
		return this.length
	}
	push() {
		this.queue.push.apply(this.queue, arguments)
		this._flush()
		return this.length
	}
	shift() {
		return new Promise((resolve, reject) => {
			if (this.queue.length > 0) {
				return resolve(this.queue.shift())
			} else {
				this.listeners.push((err) => {
					if (err) {
						return reject(err)
					}
					return resolve(this.queue.shift())
				})
			}
		})
	}
	pop() {
		return new Promise((resolve, reject) => {
			if (this.queue.length > 0) {
				return resolve(this.queue.pop())
			} else {
				this.listeners.push((err) => {
					if (err) {
						return reject(err)
					}
					return resolve(this.queue.pop())
				})
			}
		})
	}
}

module.exports = WaitQueue