
import { getStoreContext } from './storeContext';

export const AjwahStore = {
    install(Vue, options) {
        const _store = getStoreContext(options);
        Vue.prototype.ajwahStore = _store;
        Vue.prototype.store = _store;
    }
}