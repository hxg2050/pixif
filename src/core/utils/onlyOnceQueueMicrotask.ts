import { Ticker } from "pixi.js";

export const onlyOnceQueueMicrotask = <T extends (...args: Parameters<T>) => ReturnType<T>>(fn: T): T => {
    let run = false;
    return ((...args: Parameters<T>) => {
        console.log('onlyOnceQueueMicrotask', performance.now());
        if (!run) {
            run = true;
            queueMicrotask(() => {
                console.log('queueMicrotask', performance.now());
                fn(...args);
                run = false;
            });
        }
    }) as T
}