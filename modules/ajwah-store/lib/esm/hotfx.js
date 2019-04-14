import { getStore } from './storeContext';
import { Subscription } from 'rxjs';

export function dispatch(actionName, payload) {
    try {
        return getStore().dispatch(actionName, payload);
    } catch (error) {
        throw 'usually dispatch() function does not work in vue. You need to set the \'exposeStore\' boolean option \'true\' to make it workable. ex: Vue.use(AjwahStore, {exposeStore:true})';
    }
}

export function subscriptions(obj) {
    var subs = new Subscription();
    Object.keys(obj).forEach(function (stateName) {
        return subs.add(getStore().select(stateName).subscribe(function (data) {
            return obj[stateName](data);
        }));
    });
    return function () {
        return subs.unsubscribe();
    };
}