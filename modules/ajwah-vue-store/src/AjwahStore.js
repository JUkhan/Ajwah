
import { getStoreContext } from './storeContext';

export const AjwahStore = {
    install(Vue, options) {
        Vue.prototype.$tore = getStoreContext(options);
    }
}