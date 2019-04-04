export function updateObject(state: any, params = {}) {
    return { ...state, ...params };
}