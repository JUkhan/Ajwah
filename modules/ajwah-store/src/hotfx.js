import { getStore } from './storeContext';
import { Subscription } from 'rxjs';

export function dispatch(actionName, payload) {
    try {
        return getStore().dispatch(actionName, payload);
    } catch (error) {
        throw `usually dispatch() function does not work in vue. You need to set the 'exposeStore' boolean option 'true' to make it workable. ex: Vue.use(AjwahStore, {exposeStore:true})`;
    }

}

export function subscriptions(obj) {
    const subs = new Subscription();
    Object.keys(obj).forEach(stateName =>
        subs.add(
            getStore()
                .select(stateName)
                .subscribe(data => obj[stateName](data))
        )
    );
    return () => subs.unsubscribe();
}