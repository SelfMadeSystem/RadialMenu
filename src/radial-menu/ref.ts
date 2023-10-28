export interface Ref<T> {
    get(): T;
    set(value: T): void;
}

export function createRef<T>(value: T): Ref<T> {
    return {
        get: () => value,
        set: (v) => value = v,
    };
}
