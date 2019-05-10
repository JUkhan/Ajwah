import { Subscription, merge } from "rxjs";
import { mergeEffects } from "./decorators/effect";
import { storeCtx } from './storeContext';

export class EffectSubscription extends Subscription {
    constructor(store) {
        super();
        this.store = store;
    }
    addEffect(effObservable) {
        this.add(effObservable.subscribe(this.store));
    }
    addEffectByKey(effObservable, subscription) {
        subscription.add(effObservable.subscribe(this.store));
    }
    addEffects(effectInstances, action$) {

        const sources = effectInstances.reduce((arr, instance) => {
            arr.push(mergeEffects(instance, action$, storeCtx()));
            return arr;
        }, []);
        const merged = merge(...sources);
        this.add(merged.subscribe(this.store));

    }
    addEffectsByKey(instance, action$, subscription) {
        const merged = mergeEffects(instance, action$, storeCtx());
        subscription.add(merged.subscribe(this.store));

    }
    dispose() {
        this.unsubscribe();
    }
}