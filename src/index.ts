/*
 * Javascript WaitQueue Object
 * https://github.com/flarestart/wait-queue
 */
import LinkedList from './libs/LinkedList';

class WaitQueue<T> {
  [Symbol.iterator]: () => { next: () => { value: any; done: boolean } };

  queue = new LinkedList<T>();
  listeners = new LinkedList<(err?: Error) => unknown>();

  get length(): number {
    return this.queue.length;
  }
  
  numWaiters(): number {
    return this.listeners.length;
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
  
  unshift(item: T): number {
    this.queue.unshift(item);
    this._flush();
    return this.length;
  }

  push(item: T): number {
    this.queue.push(item);
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

      if (self.queue.length > 0) {
        return resolve(fn());
      } else {
        let timerId: NodeJS.Timeout | undefined;

        const listener = self.listeners.push((err?: Error) => {
          if (timerId) {
            clearTimeout(timerId);
            timerId = undefined;
          }

          if (err) {
            return reject(err);
          }

          return resolve(fn());
        });
        
        timerId = (timeout && timeout > 0) ?
          setTimeout(() => {
            timerId = undefined;
            self.listeners.remove(listener);
            reject(new Error("Timed Out"));
          }, timeout) : undefined;
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
    return this.queue[Symbol.iterator]();
  };
}

export = WaitQueue;