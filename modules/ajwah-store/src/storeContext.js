
import { Store } from './store';
import { Dispatcher } from './dispatcher';
import { EffectSubscription } from './effectSubscription';
import { Actions } from './actions';
import { Subscription } from 'rxjs';
import { STATE_METADATA_KEY, EFFECT_METADATA_KEY, IMPORT_STATE } from './tokens';
import { setKeys, setActionsAndEffects } from './decorators/altdecoretors';
import { withLatestFrom, map } from 'rxjs/operators';
import { copyObj } from './utils';

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
        this._addEffectsByKey(instance, key, this.actions);
        return this;
    }
    removeState(stateName) {
        this.store.removeState(stateName);
        this.removeEffectsByKey(stateName);
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
            this._addEffectsByKey(callback(this.actions, this), key);
        } else {
            this.effSubs.addEffect(callback(this.actions, this));
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
    addEffects(effectClassType) {
        setActionsAndEffects(effectClassType, false);
        const instance = new effectClassType();
        if (instance.effectKey) {
            instance[EFFECT_METADATA_KEY].key = instance.effectKey;
        }
        const key = instance[EFFECT_METADATA_KEY].key;
        if (key) {
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
        return this.dispatcher.pipe(
            withLatestFrom(this.store),
            map(arr => {
                arr[1] = copyObj(arr[1]);
                return arr;
            })
        )
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
export function setStoreContext(options) {
    storeContextFactory(options);
}

export function storeCtx() {
    return __store;
}