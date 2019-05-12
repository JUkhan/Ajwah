import { store } from './storeContext';

export function dispatch(actionName, payload) {
    return store().dispatch(actionName, payload);
}
