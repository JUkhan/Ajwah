import { storeCtx } from './storeContext';
import { Subscription } from 'rxjs';

export function dispatch(actionName, payload) {
    try {
        return storeCtx().dispatch(actionName, payload);
    } catch (error) {
        throw `usually dispatch() function does not work in vue. You need to set the 'exposeStoreContext' boolean option 'true' to make it workable. ex: Vue.use(AjwahStore, {exposeStoreContext:true})`;
    }

}
