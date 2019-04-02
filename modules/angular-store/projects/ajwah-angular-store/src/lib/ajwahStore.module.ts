
import { Dispatcher } from './Dispatcher';
import { NgModule, Injector, Type, ModuleWithProviders } from '@angular/core';
import { ROOT_STATES, ROOT_EFFECTS } from './tokens';
import { Store } from './Store';
import { Actions } from './Actions';
import { EffectsSubscription } from './EffectsSubscription';
let __devTools = undefined;
@NgModule({})
export class AjwahStoreModule {
    static bootstrap(options: {
        states: Type<any>[];
        effects?: Type<any>[];
        devTools?: any;
    }): ModuleWithProviders<AjwahStoreModule> {
        const rootStates = options.states || [];
        const rootEffects = options.effects || [];
        __devTools = options.devTools;
        console.log(__devTools);
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


export function _storeFactory(states, dispatcher, effect, injector, effects) {
    const store = new Store(states, dispatcher, effect, injector, effects);
    if (__devTools && __devTools.run) {
        setTimeout(() => {
            runDevTools({ store, dispatcher });
        });
    }
    return store;
}

export function createSourceInstances(...instances) {
    return instances;
}

function runDevTools(config: any) {
    __devTools.run(config);
}