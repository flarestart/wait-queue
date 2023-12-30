import LinkedList from './libs/LinkedList';
declare class WaitQueue<T> {
    [Symbol.iterator]: () => {
        next: () => {
            value: any;
            done: boolean;
        };
    };
    queue: LinkedList<T>;
    listeners: LinkedList<(err?: Error | undefined) => unknown>;
    get length(): number;
    numWaiters(): number;
    empty(): void;
    clear(): void;
    clearListeners(): void;
    unshift(item: T): number;
    push(item: T): number;
    private _remove;
    shift(timeout?: number): Promise<T>;
    pop(timeout?: number): Promise<T>;
    private _flush;
}
export = WaitQueue;
