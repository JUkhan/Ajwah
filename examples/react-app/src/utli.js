import { getStore } from 'ajwah-store'

export function updateObject(state, props = {}) {
    return { ...state, ...props }
}

