
import { getStoreContext, setStoreContext, getStore } from './storeContext';

export var AjwahStore = {
    install: function install(Vue, options) {
        options.exposeStore = options.exposeStore || false;
        var _store = options.exposeStore ? setStoreContext(options) || getStore() : getStoreContext(options);
        Vue.prototype.store$ = _store;
        Vue.prototype.store = _store;
    }
};