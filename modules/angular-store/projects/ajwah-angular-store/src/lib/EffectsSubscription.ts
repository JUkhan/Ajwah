

import { Subscription, merge } from "rxjs";
import { mergeEffects } from "./decorators/effect";
import { Injectable, OnDestroy } from '@angular/core';
import { Dispatcher } from './dispatcher';

@Injectable()
export class EffectsSubscription extends Subscription implements OnDestroy {
    constructor(private dispatcher: Dispatcher) {
        super();
    }


    addEffects(effectInstances) {
        const sources = effectInstances.map(instance => mergeEffects(instance));
        const merged = merge(...sources);
        this.add(merged.subscribe(this.dispatcher));
    }

    addEffectsByKey(instance, subscription) {
        const merged = mergeEffects(instance);
        subscription.add(merged.subscribe(this.dispatcher));
    }

    ngOnDestroy() {
        this.unsubscribe();
    }
}
