export function updateObject(state, params = {}) {
    return { ...state, ...params };
}