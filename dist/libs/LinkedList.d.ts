interface INode {
    _next: INode | null;
    _prev: INode | null;
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
    _front: INode | null;
    _end: INode | null;
    readonly length: number;
    empty(): void;
    push(...items: any[]): number;
    shift(): any;
    unshift(...items: any[]): number;
    pop(): any;
}
export = LinkedList;
