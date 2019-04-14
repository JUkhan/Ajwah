
import { getStoreContext, setStoreContext, getStore } from './storeContext';

export const AjwahStore = {
    install(Vue, options) {
        options.exposeStore = options.exposeStore || false;
        const _store = options.exposeStore ? (setStoreContext(options) || getStore()) : getStoreContext(options);
        Vue.prototype.store$ = _store;
        Vue.prototype.store = _store;
    }
}