import LinkedList from './libs/LinkedList';
declare class WaitQueue<T> {
    [Symbol.iterator]: () => {
        next: () => {
            value: any;
            done: boolean;
        };
    };
    queue: LinkedList;
    listeners: LinkedList;
    get length(): number;
    empty(): void;
    clear(): void;
    clearListeners(): void;
    unshift(...items: T[]): number;
    push(...items: T[]): number;
    private _remove;
    shift(timeout?: number): Promise<T>;
    pop(timeout?: number): Promise<T>;
    private _flush;
}
export = WaitQueue;
