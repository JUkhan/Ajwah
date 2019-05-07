import { storeCtx } from './storeContext';

export function dispatch(actionName, payload) {
    return storeCtx().dispatch(actionName, payload);
}
