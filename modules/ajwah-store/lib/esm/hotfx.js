import { getStore } from './storeContext';
import { Subscription } from 'rxjs';

export function dispatch(actionName, payload) {
    try {
        return getStore().dispatch(actionName, payload);
    } catch (error) {
        throw 'This dispatch() function should not work in vue. please use this.store.dispatch()';
    }
}

export function subscribe(obj) {
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