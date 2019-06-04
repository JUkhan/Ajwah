import { Dispatcher } from './dispatcher';
import { NgModule, Type, ModuleWithProviders, Inject, OnDestroy } from '@angular/core';
import { ROOT_STATES, ROOT_EFFECTS, IMPORT_STATE, FEATURE_STATES, FEATURE_EFFECTS } from './tokens';
import { Store } from './store';
import { Actions } from './actions';
import { EffectsSubscription } from './effectsSubscription';
import { setActionsAndEffects, setKeys } from './decorators/altdecoretors';
import { flatMap } from './utils';

let __devTools = undefined;
let __enableCodingByConvention = false;

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
        this.store.removeFeatureStates(flatMap(this.featureStates));
        this.store.removeFeatureEffects(flatMap(this.featureEffects));
    }
    constructor(
        private store: Store<any>,
        @Inject(FEATURE_STATES) private featureStates: any[],
        @Inject(FEATURE_EFFECTS) private featureEffects: any[]) {

        this.store.addFeatureStates(flatMap(featureStates));
        if (featureEffects.length) {
            this.store.addFeatureEffects(flatMap(featureEffects));
        }
    }
    xflat(arr: any[]) {
        return [].concat.apply([], arr);
    }

}
/**
 * Ajwah is a Rx based state management library for React, Vue, Angular, Flutter, Preact and others.
 * Manage your application's states, effects, and actions easy way.
 * It's easy to use in functional components with React hooks.
 * 
 * 
 * AjwahStoreModule.forRoot(...) is the entry function. 
 * 
 * for feature module you can use AjwahStoreModule.forFeature(...)
 * 
 * ###Example
 * 
 * ```typescript
 * 
 *import { AjwahStoreModule } from 'ajwah-angular-store';
 * 
 * @NgModule({
 *   declarations: [],
 *   imports: [
 *     BrowserModule, FormsModule, HttpClientModule, AppRoutingModule,
 *   AjwahStoreModule.forRoot({
 *      rootStates: [counterState],
 *       //effects: [SearchEffects],
 *       //devTools: devTools(),
 *       //actionsMethodStartsWith: 'on',
 *       //effectsMethodStartsWith: 'myEffect',
 *       enableCodingByConvention: true
 *     })
 *  ],
 *  
 *   bootstrap: [AppComponent]
 * })
 * export class AppModule { }
 * 
 * ```
 */
@NgModule({})
export class AjwahStoreModule {

    static forFeature(options: {
        featureStates: Type<any>[];
        featureEffects?: Type<any>[];
    }): ModuleWithProviders<StoreFeatureModule> {
        const featureStates = options.featureStates || [];
        const featureEffects = options.featureEffects || [];
        if (__enableCodingByConvention) {
            featureStates.forEach(item => { setActionsAndEffects(item); });
            featureEffects.forEach(item => { setActionsAndEffects(item, false); });
        }
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
        enableCodingByConvention?: boolean
        actionsMethodStartsWith?: string
        effectsMethodStartsWith?: string
    }): ModuleWithProviders<StoreRootModule> {
        const rootStates = options.rootStates || [];
        const rootEffects = options.rootEffects || [];
        __devTools = options.devTools;
        __enableCodingByConvention = options.enableCodingByConvention;
        setKeys(options.actionsMethodStartsWith, options.effectsMethodStartsWith);
        if (__enableCodingByConvention) {
            rootStates.forEach(item => { setActionsAndEffects(item); });
            rootEffects.forEach(item => { setActionsAndEffects(item, false); });
        }
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
