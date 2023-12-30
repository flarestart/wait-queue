interface Node<T> {
    _next: Node<T>;
    _prev: Node<T>;
    _removed?: boolean;
    item: T;
}
declare class LinkedList<T> {
    [Symbol.iterator]: () => {
        next: () => {
            value: T;
            done: boolean;
        };
    };
    _length: number;
    _head: Node<T>;
    constructor();
    empty(): void;
    get length(): number;
    push(item: T): Node<T>;
    unshift(item: T): Node<T>;
    pop(): T;
    shift(): T;
    remove(node: Node<T>): void;
}
export default LinkedList;
