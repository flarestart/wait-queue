/*
 * Javascript WaitQueue Object
 * https://github.com/flarestart/wait-queue
 */
'use strict'
const EventEmitter = require('events').EventEmitter

class TerminateError extends Error{
	constructor(message){
		super(message)
		this.isTerminateQueue = true
	}
}

class WaitQueue extends EventEmitter{
	constructor(){
		super()
		this.queue = []
		this.listeners = []
		this.terminated = false
	}
	_flush(){
		if(this.terminated){
			while(this.listeners.length > 0){
				let listener = this.listeners.shift()
				setImmediate(listener.bind(this))
			}
		}else{
			if(this.queue.length > 0 && this.listeners.length > 0){
				let listener = this.listeners.shift()
				// delay listener
				listener.call(this)
				setImmediate(this._flush.bind(this))
			}
		}
	}
	empty(){
		this.queue = []
	}
	unshift(item){
		let success = false
		if(!this.terminated){
			success = true
			this.queue.unshift(item)
		}
		this._flush()
		return success
	}
	push(item){
		let success = false
		if(!this.terminated){
			success = true
			this.queue.push(item)
		}
		this._flush()
		return success
	}
	shift(){
		return new Promise((resolve, reject)=>{
			if(this.queue.length > 0){
				return resolve(this.queue.shift())
			}else{
				this.listeners.push(()=>{
					return resolve(this.queue.shift())
				})
			}
		})
		.then((item)=>{
			if(this.terminated){
				throw new TerminateError('WaitQueue Terminate')
			}
			return item
		})
	}
	pop(){
		return new Promise((resolve, reject)=>{
			if(this.queue.length > 0){
				return resolve(this.queue.pop())
			}else{
				this.listeners.push(()=>{
					return resolve(this.queue.pop())
				})
			}
		})
		.then((item)=>{
			if(this.terminated){
				throw new TerminateError('WaitQueue Terminate')
			}
			return item
		})
	}
	terminate(){
		this.terminated = true
		this.queue = []
		this._flush()
		this.emit('terminate')
	}
}

module.exports = WaitQueue