import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";

import { Action } from "./action";
import { Actions } from "./actions";

export interface RegisterState<M = any, S = any> {
  stateName: string;
  initialState: M;
  mapActionToState: (
    state: M,
    action: Action,
    emit: (state: M | ((state: M) => M)) => M,
    select: () => S
  ) => void;
}

export class MonoStore<S = any> {
  public _store: BehaviorSubject<any>;
  private _stateSubscriptions: Map<String, Subscription>;
  public _dispatcher = new BehaviorSubject<Action>({ type: "@INIT" });
  constructor(states: RegisterState[]) {
    this._store = new BehaviorSubject<any>({});
    this._stateSubscriptions = new Map<String, Subscription>();
    states.forEach((s) => {
      this.registerState(s);
    });
    this.dispatch = this.dispatch.bind(this);
  }
  public action$ = new Actions(this._dispatcher);

  registerState<M>({
    stateName,
    initialState,
    mapActionToState,
  }: RegisterState<M>): void {
    if (this._store.value[stateName]) {
      return;
    }
    this._store.value[stateName] = initialState;

    this.dispatch({ type: `registerState(${stateName})` });

    const emitState = (state: any) => {
      if (typeof state === "function") {
        state = state(this._store.value[stateName]) as any;
      }
      if (this._store.value[stateName] !== state) {
        this._store.value[stateName] = state;
        this._store.next(this._store.value);
      }
      return state;
    };

    this._stateSubscriptions.set(
      stateName,
      this._dispatcher.subscribe((action) => {
        mapActionToState(
          this._store.value[stateName],
          action,
          emitState,
          () => this._store.value
        );
      })
    );
  }
  unregisterState(stateName: string) {
    if (this._store.value[stateName]) {
      this._stateSubscriptions.delete(stateName);
      delete this._store.value[stateName];
      setTimeout(() => {
        this.dispatch(`@unregisterState(${stateName})`);
      }, 0);
    }
  }
  dispatch<V extends Action = Action>(actionName: V): void;
  dispatch(actionName: string): void;
  dispatch(actionName: string, payload?: any): void;
  dispatch(actionName: string | Action, payload?: any): void {
    if (typeof actionName === "object") {
      this._dispatcher.next(actionName);
      return;
    }
    this._dispatcher.next({ type: actionName, payload });
  }
  getState(): S {
    return this._store.value;
  }
  select<T = any>(mapFn: (state: S) => any): Observable<T> {
    let mapped$;
    if (typeof mapFn === "function") {
      mapped$ = this._store.pipe(map((source: any) => mapFn(source)));
    } else {
      throw new TypeError(
        `Unexpected type '${typeof mapFn}' in select operator,` +
          ` expected 'function'`
      );
    }
    return mapped$.pipe(distinctUntilChanged());
  }
  dispose(): void {
    this._stateSubscriptions.forEach((value, key) => {
      value.unsubscribe();
    });
    this._stateSubscriptions.clear();
    this._store.unsubscribe();
  }
}

export function createStore(states: RegisterState[]) {
  return new MonoStore(states);
}
