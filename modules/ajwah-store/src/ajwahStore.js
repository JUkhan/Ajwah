
import { getStoreContext, setStoreContext, storeCtx } from './storeContext';

export const AjwahStore = {
    install(Vue, options) {
        options.exposeStoreContext = options.exposeStoreContext || false;
        const _store = options.exposeStoreContext ? (setStoreContext(options) || storeCtx()) : getStoreContext(options);
        Vue.prototype.storeCtx = _store;
    }
}