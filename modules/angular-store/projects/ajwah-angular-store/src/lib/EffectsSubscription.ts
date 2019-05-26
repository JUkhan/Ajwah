import { Subscription, merge } from "rxjs";
import { mergeEffects } from "./decorators/effect";
import { Injectable, OnDestroy } from '@angular/core';
import { Dispatcher } from './dispatcher';
import { Actions } from './actions';

@Injectable()
export class EffectsSubscription extends Subscription implements OnDestroy {
    constructor(private dispatcher: Dispatcher, private action$: Actions) {
        super();
    }
    addEffects(effectInstances) {
        const sources = effectInstances.map(instance => mergeEffects(instance, this.action$));
        const merged = merge(...sources);
        this.add(merged.subscribe(this.dispatcher));
    }
    addEffect(instance) {
        const merged = mergeEffects(instance, this.action$);
        this.add(merged.subscribe(this.dispatcher));
    }

    addEffectsByKey(instance, subscription) {
        const merged = mergeEffects(instance, this.action$);
        subscription.add(merged.subscribe(this.dispatcher));
    }

    ngOnDestroy() {
        this.unsubscribe();
    }
}
