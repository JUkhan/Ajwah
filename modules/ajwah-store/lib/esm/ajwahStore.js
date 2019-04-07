
import { getStoreContext } from './storeContext';

export var AjwahStore = {
    install: function install(Vue, options) {
        var _store = getStoreContext(options);
        Vue.prototype.store$ = _store;
        Vue.prototype.store = _store;
    }
};