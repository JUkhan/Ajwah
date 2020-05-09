import {
  BehaviorSubject,
  Subscription,
  Observable,
  queueScheduler,
} from "rxjs";
import { map, distinctUntilChanged, pluck, observeOn } from "rxjs/operators";

import { Dispatcher } from "./dispatcher";
import { copyObj, IMPORT_STATE, Action, Reducer } from "./utils";

export class Store<S = any> extends BehaviorSubject<any> {
  private states: any[] = [];
  private storeSubscription: Subscription = Subscription.EMPTY;
  action: Action = { type: "@@INIT" };
  constructor(public dispatcher: Dispatcher) {
    super({});
  }

  __init__(rootStates: any[]) {
    this.states = rootStates;
    this.storeSubscription = this.dispatcher
      .pipe(observeOn(queueScheduler))
      .subscribe((action) => {
        this.combineStates(this.value, action);
      });
  }
  private combineStates(currentState: any, action: Action) {
    for (const obj of this.states) {
      this.bindGen(currentState, obj, action);
    }
  }
  private async bindGen(currentState: any, obj: any[], action: Action) {
    for await (const newState of obj[1](currentState[obj[0]], action)) {
      if (currentState[obj[0]] !== newState) {
        currentState[obj[0]] = newState;
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
      return this;
    }
    this.dispatcher.next({ type: actionName, payload });
    return this;
  }

  stateChange(state: any, action: Action) {
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

  error(error: any) {
    this.dispatcher.error(error);
  }

  complete() {
    this.dispatcher.complete();
  }

  destroy() {
    this.storeSubscription.unsubscribe();
    this.complete();
  }

  addState(stateName: string, reducer: any) {
    if (!this.states.find((it) => it[0] === stateName)) {
      this.states.push([stateName, reducer]);
      this.next({ type: `add_state(${stateName})` });
    }
  }

  removeState(stateName: string) {
    if (this.states.find((it) => it[0] === stateName)) {
      this.states = this.states.filter((it) => it[0] !== stateName);
      const state = copyObj(this.value);
      delete state[stateName];
      this.stateChange(state, { type: `remove_state(${stateName})` });
    }
  }

  importState(state: any) {
    Object.keys(this.states).forEach((key) => {
      if (!state[key]) {
        /*const obj = this.states.find((it) => it[0] === key);
        if (obj) {
          state[key] = copyObj(obj.initState);
        }*/
        state[key] = {};
      }
    });
    this.stateChange(state, { type: IMPORT_STATE });
  }

  exportState(): Observable<any[]> {
    return this.pipe(map((state) => [this.action, copyObj(state)]));
  }
}
