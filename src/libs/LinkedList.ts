/*
 * Javascript WaitQueue Object in ES5
 * https://github.com/flarestart/wait-queue-es5
 */

interface Node<T> {
  _next: Node<T>;
  _prev: Node<T>;
  _removed?: boolean;
  item: T
}

function createNode<T>(item?: T): Node<T> {
  const tmp : {
  _next: Node<T> | null;
  _prev: Node<T> | null;
  item?: T
} = {
    _next: null,
    _prev: null,
    item: item
  }

  tmp._next = tmp as Node<T>;
  tmp._prev = tmp as Node<T>;

  return tmp as Node<T>;
}

class LinkedList<T> {
  [Symbol.iterator]: () => { next: () => { value: T; done: boolean } };

  _length = 0;
  _head: Node<T>;

  /* same as empty */
  constructor() {
    this._head = createNode<T>();
    this._length = 0;
  }

  /* same as constructor */
  empty() {
    this._head = createNode<T>();
    this._length = 0;
  }

  get length() {
    return this._length;
  }

  push(item: T) {
    const node = createNode(item);

    node._next = this._head;
    node._prev = this._head._prev;
    this._head._prev._next = node;
    this._head._prev = node;
    if (this._head._next == this._head) {
      this._head._next = node;
    }
    this._length++;

    return node;
  }

  unshift(item: T) {
    const node = createNode(item);

    node._prev = this._head;
    node._next = this._head._next;
    this._head._next._prev = node;
    this._head._next = node;
    if (this._head._prev == this._head) {
      this._head._prev = node;
    }
    this._length++;

    return node;
  }

  pop() {
    if (this._head._prev == this._head) {
      throw new Error("empty list")
    }

    const item = this._head._prev;
    this._head._prev = item._prev;
    item._prev._next = this._head

    item._removed = true;
    this._length--;

    return item.item
  }

  shift() {
    if (this._head._next == this._head) {
      throw new Error("empty list")
    }

    const item = this._head._next;
    this._head._next = item._next
    item._next._prev = this._head;

    item._removed = true;
    this._length--;

    return item.item
  }

  remove(node: Node<T>) {
    if (node._removed) {
      return;
    }
    node._prev._next = node._next;
    node._next._prev = node._prev;

    node._removed = true;
    this._length--;
  }
}

/* istanbul ignore next */
if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
  LinkedList.prototype[Symbol.iterator] = function() {
    const head = this._head;
    let node = this._head._next;
    return {
      next() {
        if (node === head) {
          return { value: null, done: true };
        }
        const r = { value: node.item, done: false };
        node = node._next;
        return r;
      }
    };
  };
}

export default LinkedList;
