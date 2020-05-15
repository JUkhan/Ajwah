import {
  BehaviorSubject,
  Subscription,
  Observable,
  queueScheduler,
} from "rxjs";
import {
  map,
  distinctUntilChanged,
  pluck,
  observeOn,
  withLatestFrom,
} from "rxjs/operators";

import { Dispatcher } from "./dispatcher";
import { Injectable, Injector, Type, OnDestroy } from "@angular/core";
import { IMPORT_STATE } from "./tokens";

import { copyObj } from "./utils";
import { BaseState, Action } from "./BaseState";

@Injectable()
export class Store<S = any> extends BehaviorSubject<any> implements OnDestroy {
  private states: BaseState[];
  private storeSubscription: Subscription;
  action: Action = { type: "@@INIT" };
  constructor(private dispatcher: Dispatcher, private injector: Injector) {
    super({});
  }

  __init__(rootStates: BaseState[]) {
    this.states = rootStates;
    this.storeSubscription = this.dispatcher
      .pipe(observeOn(queueScheduler))
      .subscribe((action) => {
        this.combineStates(this.getValue(), action);
      });
  }
  private combineStates(currentState: any, action: Action) {
    for (const obj of this.states) {
      this.bindGen(currentState, obj, action);
    }
  }
  private async bindGen(currentState: any, obj: BaseState, action: Action) {
    for await (const newState of obj.mapActionToState(
      currentState[obj.stateName] || copyObj(obj.initState),
      action
    )) {
      if (currentState[obj.stateName] !== newState) {
        currentState[obj.stateName] = newState;
        this.stateChange(currentState, action);
      }
    }
  }
  dispatch<V extends Action = Action>(actionName: V): Store;
  dispatch(actionName: string): Store;
  dispatch(actionName: string, payload?: any): Store;
  dispatch(actionName: string | Action, payload?: any): Store {
    if (typeof actionName === "object") {
      this.dispatcher.next(actionName);
      return;
    }
    this.dispatcher.next({ type: actionName, payload });
    return this;
  }

  stateChange(state, action) {
    this.action = action;
    super.next(state);
  }
  select<T = any>(pathOrMapFn: ((state: S) => any) | string): Observable<T> {
    let mapped$;
    if (typeof pathOrMapFn === "string") {
      mapped$ = this.pipe(pluck(pathOrMapFn));
    } else if (typeof pathOrMapFn === "function") {
      mapped$ = this.pipe(map((source: any) => pathOrMapFn(source)));
    } else {
      throw new TypeError(
        `Unexpected type '${typeof pathOrMapFn}' in select operator,` +
          ` expected 'string' or 'function'`
      );
    }
    return mapped$.pipe(distinctUntilChanged());
  }

  next(action: Action) {
    this.dispatcher.next(action);
  }

  error(error) {
    this.dispatcher.error(error);
  }

  complete() {
    this.dispatcher.complete();
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
    this.complete();
  }

  addState(stateClassType: Type<BaseState>): Store {
    const instance = this.injector.get(stateClassType);
    this.states.push(instance);
    this.next({ type: `add_state(${name})` });
    return this;
  }

  removeState(stateName): Store {
    if (this.states.find((it) => it.stateName === stateName)) {
      this.states = this.states.filter((it) => it.stateName !== stateName);
      const state = copyObj(this.value);
      delete state[stateName];
      this.stateChange(state, { type: `remove_state(${stateName})` });
    }
    return this;
  }

  importState(state: any) {
    this.stateChange(state, { type: IMPORT_STATE });
  }

  exportState(): Observable<any[]> {
    return this.pipe(map((state) => [this.action, copyObj(state)]));
  }

  /**
   *
   * @param featureStates
   */
  addFeatureStates(featureStates: any[]) {
    for (const state of featureStates) {
      if (!this.states.find((it) => it.stateName === state.stateName)) {
        this.states.push(state);
        this.next({ type: `add_state(${state.stateName})` });
      }
    }
  }

  /**
   *
   * @param featureStates
   */
  removeFeatureStates(featureStates: any[]) {
    for (const state of featureStates) {
      this.removeState(state.stateName);
    }
  }
}
