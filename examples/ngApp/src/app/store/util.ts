export function updateObject<S = any>(state: S, props?: S): S {
    return { ...state, ...(props || {}) };
}