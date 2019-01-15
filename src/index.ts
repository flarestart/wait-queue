/*
 * Javascript WaitQueue Object
 * https://github.com/flarestart/wait-queue
 */
const LinkedList = require('./libs/LinkedList');

const nextTick = (() => {
  if (typeof process === 'object' && process.nextTick) {
    return process.nextTick;
  }
  if (typeof setImmediate === 'function') {
    return setImmediate;
  }
  return setTimeout;
})();

class WaitQueue {
  [Symbol.iterator]: () => { next: () => { value: any; done: boolean } };

  queue = new LinkedList();
  listeners = new LinkedList();

  get length() {
    return this.queue.length;
  }
  empty() {
    this.queue = new LinkedList();
  }
  clear() {
    this.queue = new LinkedList();
  }
  clearListeners() {
    for (const listener of this.listeners) {
      listener(new Error('Clear Listeners'));
    }
    this.listeners = new LinkedList();
  }
  unshift(...items: any[]) {
    this.queue.unshift(...items);
    this._flush();
    return this.length;
  }
  push(...items: any[]) {
    this.queue.push(...items);
    this._flush();
    return this.length;
  }
  shift() {
    return new Promise((resolve, reject) => {
      if (this.queue.length > 0) {
        return resolve(this.queue.shift());
      } else {
        this.listeners.push((err: Error) => {
          if (err) {
            return reject(err);
          }
          return resolve(this.queue.shift());
        });
      }
    });
  }
  pop() {
    return new Promise((resolve, reject) => {
      if (this.queue.length > 0) {
        return resolve(this.queue.pop());
      } else {
        this.listeners.push((err: Error) => {
          if (err) {
            return reject(err);
          }
          return resolve(this.queue.pop());
        });
      }
    });
  }

  private _flush() {
    if (this.queue.length > 0 && this.listeners.length > 0) {
      const listener = this.listeners.shift();
      listener.call(this);
      // delay next loop
      nextTick(this._flush.bind(this));
    }
  }
}

if (typeof Symbol !== 'undefined') {
  WaitQueue.prototype[Symbol.iterator] = function() {
    let node = this.queue._front;
    return {
      next() {
        if (node === null) {
          return { value: null, done: true };
        } else {
          const r = { value: node.item, done: false };
          node = node._next;
          return r;
        }
      },
    };
  };
}

export = WaitQueue;
