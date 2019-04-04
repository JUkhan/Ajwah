

import { Subscription, merge, Observer } from "rxjs";
import { mergeEffects } from "./decorators/effect";
import { Injectable, OnDestroy } from '@angular/core';
import { Actions } from './actions';

@Injectable()
export class EffectsSubscription extends Subscription implements OnDestroy {
    constructor(private actions: Actions) {
        super();
    }
    store: Observer<any>;

    addEffects(effectInstances) {
        const sources = effectInstances.map(instance => mergeEffects(instance, this.actions, this.store));
        const merged = merge(...sources);
        this.add(merged.subscribe(this.store));
    }

    addEffectsByKey(instance, subscription) {
        const merged = mergeEffects(instance, this.actions, this.store);
        subscription.add(merged.subscribe(this.store));
    }

    ngOnDestroy() {
        this.unsubscribe();
    }
}
