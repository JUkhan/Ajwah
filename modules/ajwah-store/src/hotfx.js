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