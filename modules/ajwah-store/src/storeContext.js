
import { Store } from './store';
import { Dispatcher } from './dispatcher';
import { EffectSubscription } from './effectSubscription';
import { Actions } from './actions';
import { Subscription } from 'rxjs';
import { STATE_METADATA_KEY, EFFECT_METADATA_KEY, IMPORT_STATE } from './tokens';
import { setKeys, setActionsAndEffects } from './decorators/altdecoretors';

class StoreContext {
    constructor(states) {
        this.subs = {};
        this.dispatcher = new Dispatcher();
        this.actions = new Actions(this.dispatcher);
        this.store = new Store(states, this.dispatcher);
        this.effSubs = new EffectSubscription(this.store);
    }
    dispatch(actionName, payload) {
        if (typeof actionName === 'object') {
            this.dispatcher.dispatch(actionName);
            return this;
        }
        this.dispatcher.dispatch({ type: actionName, payload });
        return this;
    }

    addState(stateClassType) {
        setActionsAndEffects(stateClassType);
        const instance = new stateClassType();
        this.store.addState(instance);
        const key = instance[STATE_METADATA_KEY].name;
        const hasEffect = instance[EFFECT_METADATA_KEY];
        if (hasEffect && hasEffect.effects.length > 0) {
            this.removeEffectsByKey(key);
            this._addEffectsByKey(instance, key, this.actions);
        }
        return this;
    }
    removeState(stateName) {
        this.store.removeState(stateName);
        this.removeEffectsByKey(stateName);
        return this;
    }
    select(pathOrMapFn) {
        return this.store.select(pathOrMapFn);
    }
    addEffect(callback, key) {
        this.removeEffectsByKey(key);
        this._addEffectsByKey(callback(this.actions, this), key);
        return this;
    }
    removeEffectsByKey(key) {
        if (this.subs[key]) {
            this.subs[key].unsubscribe();
            this.subs[key] = undefined;
        }
        return this;
    }
    addEffects(effectClassType) {
        setActionsAndEffects(effectClassType, false);
        const instance = new effectClassType();
        if (instance.effectKey) {
            instance[EFFECT_METADATA_KEY].key = instance.effectKey;
        }
        const key = instance[EFFECT_METADATA_KEY].key;
        if (key) {
            this.removeEffectsByKey(key);
            this._addEffectsByKey(instance, key, this.actions);
        } else {
            this.effSubs.addEffects([instance], this.actions);
        }
        return this;
    }
    _addEffectsByKey(instance, key, actions) {
        const subscription = this.subs[key] || (this.subs[key] = new Subscription());
        if (actions)
            this.effSubs.addEffectsByKey(instance, actions, subscription);
        else this.effSubs.addEffectByKey(instance, subscription);
    }
    exportState() {
        return this.store.exportState();
    }
    importState(state) {
        this.store.importState(state);
        return this;
    }

    dispose() {
        this.dispatcher.dispose();
        this.store.dispose();
        this.effSubs.dispose();
        this.devTools && this.devTools.dispose();
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
    const istates = states.map(_ => {
        setActionsAndEffects(_);
        return new _()
    })
    const ctx = new StoreContext(istates);
    __store = ctx;
    ctx.effSubs.addEffects(istates, ctx.actions);
    for (let effect of effects) {
        ctx.addEffects(effect);
    }
    if (devTools && devTools.run) {
        ctx.devTools = devTools;
        devTools.run({ dispatcher: ctx.dispatcher, store: ctx.store, importState: IMPORT_STATE });
    }
    return ctx;
}
export function createStore(options) {
    return storeContextFactory(options);
}

export function store() {
    return __store;
}