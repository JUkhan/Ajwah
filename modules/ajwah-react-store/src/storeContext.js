
import { Store } from './store';
import { Dispatcher } from './dispatcher';
import { EffectSubscription } from './effectSubscription';
import { Actions } from './actions';
import { EFFECT_METADATA_KEY } from './decorators/effect';
import { Subscription } from 'rxjs';


class StoreContext {
    constructor(states) {
        this.subs = {};
        this.dispatcher = new Dispatcher();
        this.actions = new Actions(this.dispatcher);
        this.store = new Store(states, this.dispatcher);
        this.effSubs = new EffectSubscription(this.store);
    }
    dispatch(action) {
        this.dispatcher.dispatch(action);
    }
    addState(stateClass) {
        this.store.addState(stateClass);
    }
    removeState(stateName) {
        this.store.removeState(stateName);
    }
    importState(state) {
        this.store.importState(state);
    }
    select(callback) {
        return this.store.select(callback);
    }
    addEffect(callback, key) {
        if (key && typeof key === 'string') {
            this.effSubs.addEffectByKey(callback(this.actions), this.subs[key] || (this.subs[key] = new Subscription()));
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
                const key = instance[EFFECT_METADATA_KEY].key; console.log(`key: ${key}`);
                this.effSubs.addEffectsByKey(instance, this.actions, this.subs[key] || (this.subs[key] = new Subscription()));
            });
        }
    }

    dispose() {
        this.dispatcher.dispose();
        this.store.dispose();
        this.effSubs.dispose();
        this.devTools.dispose();
    }
}
var __store = undefined;

export function setStoreContext({ states = [], effects = [], devTools = undefined }) {
    const ctx = new StoreContext(states);
    ctx.addEffects(...effects);
    __store = ctx;

    if (devTools && devTools.run) {
        ctx.devTools = devTools;
        devTools.run(ctx);
    }
}

//export const Dagger = createContext();
export function getStore() {
    return __store;;
}