/*
 * Javascript WaitQueue Object
 * https://github.com/flarestart/wait-queue
 */
import LinkedList from './libs/LinkedList';

class WaitQueue<T> {
  [Symbol.iterator]: () => { next: () => { value: any; done: boolean } };

  queue = new LinkedList();
  listeners = new LinkedList();

  get length(): number {
    return this.queue.length;
  }
  
  numListeners(): number {
    return this.listeners.length - this.numListenersDelta;
  }
  numListenersDelta = 0;

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
    this.numListenersDelta = 0;
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

  private _remove(type: "SHIFT" | "POP", timeout?: number): Promise<T> {
    let fn: () => any;
    switch (type) {
      case 'SHIFT':
        fn = this.queue.shift.bind(this.queue);
        break;
      case 'POP':
        fn = this.queue.pop.bind(this.queue);
        break;
    }

    return new Promise((resolve, reject) => {
      const self = this;
      if (this.queue.length > 0) {
        return resolve(fn());
      } else {
        let timedOut = false;
        let timerId = (timeout && timeout > 0) ?
          setTimeout(() => {
            self.numListenersDelta++;
            timedOut = true;
            timerId = undefined;
            reject(new Error("Timed Out"));
          }, timeout) : undefined;

        this.listeners.push((err: Error) => {
          if (timerId) {
            clearTimeout(timerId);
            timerId = undefined;
          }

          if (timedOut) {
            self.numListenersDelta--;
            // already rejected, doesn't matter if err via clearListeners
            return;
          }

          if (err) {
            return reject(err);
          }

          return resolve(fn());
        });
      }
    });
  }

  shift(timeout?: number): Promise<T> {
    return this._remove('SHIFT', timeout);
  }
  pop(timeout?: number): Promise<T> {
    return this._remove('POP', timeout);
  }

  private _flush(): void {
    while (this.queue.length > 0 && this.listeners.length > 0) {
      const listener = this.listeners.shift();
      listener.call(this);
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