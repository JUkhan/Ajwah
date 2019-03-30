
import { Subscription, merge, Observer } from "rxjs";
import { mergeEffects } from "./decorators/effect";
import { Injectable } from '@angular/core';

@Injectable()
export class EffectsSubscription extends Subscription {
    constructor() {
        super();
    }
    store: Observer<any>;

    addEffects(effectInstances) {
        const sources = effectInstances.map(mergeEffects);
        const merged = merge(...sources);
        this.add(merged.subscribe(this.store));
    }

    addEffectsByKey(instance, subscription) {
        const merged = mergeEffects(instance);
        subscription.add(merged.subscribe(this.store));
    }

    dispose() {
        this.unsubscribe();
    }
}
