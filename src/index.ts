/*
 * Javascript WaitQueue Object
 * https://github.com/flarestart/wait-queue
 */
import LinkedList from './libs/LinkedList';

const nextLoop = (() => {
  if (typeof setImmediate === 'function') {
    return setImmediate;
  }
  /* istanbul ignore next */
  return (fn: (...args: any[]) => void) => setTimeout(fn, 0);
})();

class WaitQueue<T> {
  [Symbol.iterator]: () => { next: () => { value: any; done: boolean } };

  queue = new LinkedList();
  listeners = new LinkedList();

  get length(): number {
    return this.queue.length;
  }
  empty(): void {
    this.queue = new LinkedList();
  }
  clear(): void {
    this.queue = new LinkedList();
  }
  clearListeners(): void {
    for (const listener of this.listeners) {
      listener(new Error('Clear Listeners'));
    }
    this.listeners = new LinkedList();
  }
  unshift(...items: T[]): number {
    this.queue.unshift(...items);
    this._flush();
    return this.length;
  }
  push(...items: T[]): number {
    this.queue.push(...items);
    this._flush();
    return this.length;
  }
  shift(): Promise<T> {
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
  pop(): Promise<T> {
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

  private _flush(): void {
    if (this.queue.length > 0 && this.listeners.length > 0) {
      const listener = this.listeners.shift();
      listener.call(this);
      // delay next loop
      nextLoop(this._flush.bind(this));
    }
  }
}

if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
  WaitQueue.prototype[Symbol.iterator] = function () {
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