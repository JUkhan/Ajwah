
import { Store } from './store';
import { Dispatcher } from './dispatcher';
import { EffectSubscription } from './effectSubscription';
import { Actions } from './actions';
import { EFFECT_METADATA_KEY } from './decorators/effect';
import { Subscription } from 'rxjs';
import { STATE_METADATA_KEY } from './decorators/state';

class StoreContext {
    constructor(states) {
        this.subs = {};
        this.dispatcher = new Dispatcher();
        this.actions = new Actions(this.dispatcher);
        this.store = new Store(states, this.dispatcher);
        this.effSubs = new EffectSubscription(this.store);
        this.effSubs.addEffects(states, this.actions);
    }
    dispatch(action) {
        this.dispatcher.dispatch(action);
    }
    addState(stateClass) {
        const instance = new stateClass();
        this.store.addState(instance);
        const key = instance[STATE_METADATA_KEY].name;
        this._addEffectsByKey(instance, key, this.actions);

    }
    removeState(stateName) {
        this.store.removeState(stateName);
        this.removeEffectsByKey(stateName);
    }
    importState(state) {
        this.store.importState(state);
    }
    select(pathOrMapFn) {
        return this.store.select(pathOrMapFn);
    }
    addEffect(callback, key) {
        if (key && typeof key === 'string') {
            this._addEffectsByKey(callback(this.actions), key);
        } else {
            this.effSubs.addEffect(callback(this.actions));
        }
        return this;
    }
    removeEffectsByKey(key) {
        if (this.subs[key]) {
            this.subs[key].unsubscribe && this.subs[key].unsubscribe();
            this.subs[key] = undefined;
        }
    }
    addEffects(...effectClassType) {
        const effects = effectClassType.map(_ => new _());
        const globalEffects = effects.filter(ef => !ef[EFFECT_METADATA_KEY].key);
        const keysEffects = effects.filter(ef => !!ef[EFFECT_METADATA_KEY].key);
        globalEffects.length && this.effSubs.addEffects(globalEffects, this.actions);
        if (keysEffects.length) {
            keysEffects.forEach(instance => {
                const key = instance[EFFECT_METADATA_KEY].key;
                this._addEffectsByKey(instance, key, this.actions);
            });
        }
    }
    _addEffectsByKey(instance, key, actions) {
        const subscription = this.subs[key] || (this.subs[key] = new Subscription());
        if (actions)
            this.effSubs.addEffectsByKey(instance, actions, subscription);
        else this.effSubs.addEffectByKey(instance, subscription);
    }

    dispose() {
        this.dispatcher.dispose();
        this.store.dispose();
        this.effSubs.dispose();
        this.devTools.dispose();
    }
}


export function getStoreContext({ states = [], effects = [], devTools = undefined }) {
    const ctx = new StoreContext(states.map(_ => new _()));
    ctx.addEffects(...effects);


    if (devTools && devTools.run) {
        ctx.devTools = devTools;
        devTools.run(ctx);
    }
    return ctx;
}
