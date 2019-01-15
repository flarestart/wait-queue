/*
 * Javascript WaitQueue Object in ES5
 * https://github.com/flarestart/wait-queue-es5
 */
interface INode {
  _next: INode | null;
  _prev: INode | null;
  item: any;
}

function createNode(item: any): INode {
  return {
    _next: null,
    _prev: null,
    item,
  };
}

class LinkedList {
  [Symbol.iterator]: () => { next: () => { value: any; done: boolean } };

  _length = 0;
  _front: INode | null = null;
  _end: INode | null = null;

  get length() {
    return this._length;
  }
  empty() {
    this._length = 0;
    this._front = null;
    this._end = null;
  }
  push(...items: any[]) {
    items.forEach((item) => {
      const node = createNode(item);
      if (this._front && this._end) {
        this._end._next = node;
        node._prev = this._end;
        this._end = node;
      } else {
        this._front = node;
        this._end = node;
      }
      this._length++;
    });
    return this._length;
  }
  shift() {
    const item = this._front;
    if (item === null) {
      return null;
    }
    if (item._next != null) {
      this._front = item._next;
      this._front._prev = null;
    } else {
      this._front = null;
      this._end = null;
    }
    item._next = null;
    this._length--;
    return item.item;
  }
  unshift(...items: any[]) {
    items.forEach(item => {
      const node = createNode(item);
      if (this._front === null) {
        this._front = node;
        this._end = node;
      } else {
        node._next = this._front;
        this._front._prev = node;
        this._front = node;
      }
      this._length++;
    });
    return this._length;
  }
  pop() {
    const item = this._end;
    if (item === null) {
      return null;
    }
    if (item._prev != null) {
      this._end = item._prev;
      this._end._next = null;
    } else {
      this._front = null;
      this._end = null;
    }
    this._length--;
    item._prev = null;
    return item.item;
  }
}

if (Symbol.iterator) {
  LinkedList.prototype[Symbol.iterator] = function() {
    let node = this._front;
    return {
      next() {
        if (node === null) {
          return { value: null, done: true };
        }
        const r = { value: node.item, done: false };
        node = node._next;
        return r;
      },
    };
  };
}

export = LinkedList;
