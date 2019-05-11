
import { Dispatcher } from './dispatcher';
import { NgModule, Injector, Type, ModuleWithProviders } from '@angular/core';
import { ROOT_STATES, ROOT_EFFECTS, IMPORT_STATE } from './tokens';
import { Store } from './store';
import { Actions } from './actions';
import { EffectsSubscription } from './effectsSubscription';
import { setActionsAndEffects, setKeys } from './decorators/altdecoretors'

let __devTools = undefined;

@NgModule({})
export class AjwahStoreModule {
    static bootstrap(options: {
        states: Type<any>[];
        effects?: Type<any>[];
        devTools?: any;
        actionsMethodStartsWith?: string;
        effectsMethodStartsWith?: string;
    }): ModuleWithProviders<AjwahStoreModule> {
        const rootStates = options.states || [];
        const rootEffects = options.effects || [];
        __devTools = options.devTools;
        setKeys(options.actionsMethodStartsWith, options.effectsMethodStartsWith);
        rootStates.forEach(state => { setActionsAndEffects(state); })
        rootEffects.forEach(effect => { setActionsAndEffects(effect, false); })
        return {
            ngModule: AjwahStoreModule,
            providers: [
                Dispatcher,
                Actions,
                EffectsSubscription,
                rootStates,
                {
                    provide: ROOT_STATES,
                    deps: rootStates,
                    useFactory: createSourceInstances,
                },
                rootEffects,
                {
                    provide: ROOT_EFFECTS,
                    deps: rootEffects,
                    useFactory: createSourceInstances,
                },
                { provide: Store, useFactory: _storeFactory, deps: [ROOT_STATES, Dispatcher, EffectsSubscription, Injector, ROOT_EFFECTS] }
            ]
        };
    }
}

var __store = undefined;
export function getStore() {
    return __store;
}
export function _storeFactory(states, dispatcher, effect, injector, effects) {
    const store = new Store(states, dispatcher, effect, injector, effects);
    if (__devTools && __devTools.run) {
        runDevTools({ store, dispatcher, importState: IMPORT_STATE });
    }
    __store = store;
    return store;
}

export function createSourceInstances(...instances) {
    return instances;
}

function runDevTools(config: any) {
    __devTools.run(config);
}
