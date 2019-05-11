import { getStore } from '../ajwahStore.module'

export function Select<S = any>(param: string | ((state: S) => any)) {
    return function (target, propertyName) {
        Object.defineProperty(target, propertyName, {
            get() {
                return getStore().select(param);
            },
            enumerable: true,
            configurable: true
        });
    };
}