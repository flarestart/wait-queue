declare class WaitQueue {
    [Symbol.iterator]: () => {
        next: () => {
            value: any;
            done: boolean;
        };
    };
    queue: any;
    listeners: any;
    readonly length: any;
    empty(): void;
    clear(): void;
    clearListeners(): void;
    unshift(...items: any[]): any;
    push(...items: any[]): any;
    shift(): Promise<{}>;
    pop(): Promise<{}>;
    private _flush;
}
export = WaitQueue;
