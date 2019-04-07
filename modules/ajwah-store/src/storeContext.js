
import { Store } from './store';
import { Dispatcher } from './dispatcher';
import { EffectSubscription } from './effectSubscription';
import { Actions } from './actions';
import { Subscription } from 'rxjs';
import { STATE_METADATA_KEY, EFFECT_METADATA_KEY } from './decorators/metakeys';
import { setKeys, setActionsAndEffects } from './decorators/altdecoretors';

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
        return this;
    }
    addStates(...stateClassTypes) {
        for (let stateClass of stateClassTypes) {
            setActionsAndEffects(stateClass);
            const instance = new stateClass();
            this.store.addState(instance);
            const key = instance[STATE_METADATA_KEY].name;
            this._addEffectsByKey(instance, key, this.actions);
        }
        return this;
    }
    removeStates(...stateNames) {
        for (let stateName of stateNames) {
            this.store.removeState(stateName);
            this.removeEffectsByKey(stateName);
        }
        return this;
    }
    importState(state) {
        this.store.importState(state);
        return this;
    }
    select(pathOrMapFn) {
        return this.store.select(pathOrMapFn);
    }
    addEffect(callback, key) {
        if (key && typeof key === 'string') {
            this._addEffectsByKey(callback(this.actions, this.store), key);
        } else {
            this.effSubs.addEffect(callback(this.actions, this.store));
        }
        return this;
    }
    removeEffectsByKey(key) {
        if (this.subs[key]) {
            this.subs[key].unsubscribe && this.subs[key].unsubscribe();
            this.subs[key] = undefined;
        }
        else {
            throw `Unknown effect key '${key}'`;
        }
        return this;
    }
    addEffects(...effectClassTypes) {
        const instances = effectClassTypes.map(_ => {
            setActionsAndEffects(_, false);
            const inst = new _();
            if (inst.effectKey) {
                inst[EFFECT_METADATA_KEY].key = inst.effectKey;
            }
            return inst;
        });

        const globalEffects = instances.filter(ef => !ef[EFFECT_METADATA_KEY].key);
        const keysEffects = instances.filter(ef => !!ef[EFFECT_METADATA_KEY].key);
        globalEffects.length && this.effSubs.addEffects(globalEffects, this.actions);
        if (keysEffects.length) {
            keysEffects.forEach(instance => {
                const key = instance[EFFECT_METADATA_KEY].key;
                this._addEffectsByKey(instance, key, this.actions);
            });
        }
        return this;
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
var __store = undefined;

function storeContextFactory({
    states = [],
    effects = [],
    actionsMethodStartsWith,
    effectsMethodStartsWith,
    devTools = undefined }) {
    setKeys(actionsMethodStartsWith, effectsMethodStartsWith);
    const ctx = new StoreContext(states.map(_ => {
        setActionsAndEffects(_);
        return new _()
    }));
    ctx.addEffects(...effects);

    if (devTools && devTools.run) {
        ctx.devTools = devTools;
        devTools.run(ctx);
    }
    return ctx;
}
export function setStoreContext(options) {
    __store = storeContextFactory(options);
}
export function getStoreContext(options) {
    return storeContextFactory(options);
}

export function getStore() {
    return __store;;
}