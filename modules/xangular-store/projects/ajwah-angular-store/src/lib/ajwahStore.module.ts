import { Dispatcher } from "./dispatcher";
import {
  NgModule,
  Type,
  ModuleWithProviders,
  Inject,
  OnDestroy,
} from "@angular/core";
import {
  ROOT_STATES,
  IMPORT_STATE,
  FEATURE_STATES,
  STORE_OPTIONS,
} from "./tokens";
import { Store } from "./store";
import { flatMap } from "./utils";
import { BaseState } from "./BaseState";
import { Observable } from "rxjs";

@NgModule({})
export class StoreRootModule {
  constructor(
    store: Store<any>,
    dispatcher: Dispatcher,
    @Inject(ROOT_STATES) initStates,
    @Inject(STORE_OPTIONS) options
  ) {
    if (Symbol["asyncIterator"] === undefined) {
      (Symbol as any)["asyncIterator"] = Symbol.for("asyncIterator");
    }
    store.__init__(initStates /*, initEffects*/);
    if (options.devTools && options.devTools.run) {
      options.devTools.run({ store, dispatcher, importState: IMPORT_STATE });
    }
    xstore = store;
  }
}

@NgModule({})
export class StoreFeatureModule implements OnDestroy {
  ngOnDestroy(): void {
    this.store.removeFeatureStates(flatMap(this.featureStates));
  }
  constructor(
    private store: Store<BaseState>,
    @Inject(FEATURE_STATES) private featureStates: any[]
  ) {
    this.store.addFeatureStates(flatMap(featureStates));
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
 *      //devTools: devTools(),
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
    featureStates: Type<BaseState>[];
  }): ModuleWithProviders<StoreFeatureModule> {
    return {
      ngModule: StoreFeatureModule,
      providers: [
        options.featureStates,
        {
          provide: FEATURE_STATES,
          deps: options.featureStates,
          multi: true,
          useFactory: createSourceInstances,
        },
      ],
    };
  }

  static forRoot(options: {
    rootStates: Type<BaseState>[];

    devTools?: any;
  }): ModuleWithProviders<StoreRootModule> {
    return {
      ngModule: StoreRootModule,
      providers: [
        Dispatcher,

        { provide: STORE_OPTIONS, useValue: options },
        options.rootStates,
        {
          provide: ROOT_STATES,
          deps: options.rootStates,
          useFactory: createSourceInstances,
        },

        Store,
      ],
    };
  }
}

var xstore: Store;

export function createSourceInstances(...instances) {
  return instances || [];
}

export function dispatch(actionType: any, payload?: any) {
  xstore.dispatch(actionType, payload);
}
export function select<T = any>(
  pathOrMapFn: ((state: T) => any) | string
): Observable<any> {
  return xstore.select(pathOrMapFn);
}
