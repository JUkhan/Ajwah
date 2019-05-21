
import { Dispatcher } from './dispatcher';
import { NgModule, Type, ModuleWithProviders, Inject, OnDestroy } from '@angular/core';
import { ROOT_STATES, ROOT_EFFECTS, IMPORT_STATE, FEATURE_STATES, FEATURE_EFFECTS } from './tokens';
import { Store } from './store';
import { Actions } from './actions';
import { EffectsSubscription } from './effectsSubscription';



let __devTools = undefined;

@NgModule({})
export class StoreRootModule {
    constructor(
        store: Store<any>,
        dispatcher: Dispatcher,
        @Inject(ROOT_STATES) initStates,
        @Inject(ROOT_EFFECTS) initEffects
    ) {
        store.__init__(initStates, initEffects);
        if (__devTools && __devTools.run) {
            runDevTools({ store, dispatcher, importState: IMPORT_STATE });
        }
        __store = store;
    }
}

@NgModule({})
export class StoreFeatureModule implements OnDestroy {
    ngOnDestroy(): void {
        this.store.removeFeatureStates(this.flat(this.featureStates));
        this.store.removeFeatureEffects(this.flat(this.featureEffects));
    }
    constructor(
        private store: Store<any>,
        @Inject(FEATURE_STATES) private featureStates: any[],
        @Inject(FEATURE_EFFECTS) private featureEffects: any[]) {

        this.store.addFeatureStates(this.flat(featureStates));
        if (featureEffects.length) {
            this.store.addFeatureEffects(this.flat(featureEffects));
        }
    }
    flat(arr: any[]) {
        return [].concat.apply([], arr);
    }

}

@NgModule({})
export class AjwahStoreModule {

    static forFeature(options: {
        featureStates: Type<any>[];
        featureEffects?: Type<any>[];
    }): ModuleWithProviders<StoreFeatureModule> {
        const featureStates = options.featureStates || [];
        const featureEffects = options.featureEffects || [];

        return {
            ngModule: StoreFeatureModule,
            providers: [
                featureStates,
                {
                    provide: FEATURE_STATES,
                    deps: featureStates,
                    multi: true,
                    useFactory: createSourceInstances,
                },
                featureEffects,
                {
                    provide: FEATURE_EFFECTS,
                    deps: featureEffects,
                    multi: true,
                    useFactory: createSourceInstances,
                }
            ]
        };
    }

    static forRoot(options: {
        rootStates: Type<any>[];
        rootEffects?: Type<any>[];
        devTools?: any;

    }): ModuleWithProviders<StoreRootModule> {
        const rootStates = options.rootStates || [];
        const rootEffects = options.rootEffects || [];
        __devTools = options.devTools;

        return {
            ngModule: StoreRootModule,
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
                Store
            ]
        };
    }
}

var __store = undefined;
export function getStore() {
    return __store;
}

export function createSourceInstances(...instances) {
    return instances;
}

function runDevTools(config: any) {
    __devTools.run(config);
}
