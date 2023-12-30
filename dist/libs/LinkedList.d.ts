interface Node {
    _next: Node | null;
    _prev: Node | null;
    item: any;
}
declare class LinkedList {
    [Symbol.iterator]: () => {
        next: () => {
            value: any;
            done: boolean;
        };
    };
    _length: number;
    _front: Node | null;
    _end: Node | null;
    get length(): number;
    empty(): void;
    push(...items: any[]): number;
    unshift(...items: any[]): number;
    pop(): any;
    shift(): any;
}
export default LinkedList;
