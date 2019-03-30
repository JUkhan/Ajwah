
import { Dispatcher } from './Dispatcher';
import { NgModule, Injector, Type, ModuleWithProviders } from '@angular/core';
import { ROOT_STATES, ROOT_EFFECTS } from './tokens';
import { Store } from './Store';
import { Actions } from './Actions';
import { EffectsSubscription } from './EffectsSubscription';

@NgModule({})
export class AjwahStoreModule {
    static forRoot(options: {
        rootStates: Type<any>[];
        rootEffects?: Type<any>[];
    }): ModuleWithProviders<AjwahStoreModule> {
        const rootStates = options.rootStates || [];
        const rootEffects = options.rootEffects || [];

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
    return new Store(states, dispatcher, effect, injector, effects);
}

export function createSourceInstances(...instances) {
    return instances;
}
