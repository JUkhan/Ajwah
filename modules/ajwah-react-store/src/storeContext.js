
import { Store } from './store';
import { Dispatcher } from './dispatcher';
import { EffectSubscription } from './effectSubscription';
import { Actions } from './actions';



class StoreContext {
    constructor(states) {

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
    addEffect(callback) {
        this.effSubs.addEffect(callback(this.actions));
    }
    addEffects(...effectClassType) {
        this.effSubs.addEffects(effectClassType.map(_ => new _()), this.actions);
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