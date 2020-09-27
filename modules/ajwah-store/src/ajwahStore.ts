import { BehaviorSubject, Subscription, Observable } from "rxjs";
import {
  map,
  distinctUntilChanged,
  pluck,
  withLatestFrom,
  filter,
} from "rxjs/operators";

import { Action } from "./action";
import { Actions } from "./actions";
export interface RegisterState<M> {
  stateName: string;
  initialState: M;
  mapActionToState: (
    state: M,
    action: Action,
    emit: (state: M) => void
  ) => void;
  filterActions?: (action: Action) => boolean;
}

export class AjwahStore<S = any> {
  private _dispatcher: BehaviorSubject<Action>;
  private _store: BehaviorSubject<any>;
  private _stateSubscriptions: Map<String, Subscription>;
  private _effectSubscriptions: Map<String, Subscription>;
  private _actions: Actions;
  constructor() {
    this._dispatcher = new BehaviorSubject<Action>({ type: "@INIT" });
    this._store = new BehaviorSubject<any>({});
    this._actions = new Actions(this._dispatcher);
    this._stateSubscriptions = new Map<String, Subscription>();
    this._effectSubscriptions = new Map<String, Subscription>();
  }
  registerState<M>({
    stateName,
    initialState,
    mapActionToState,
    filterActions,
  }: RegisterState<M>): void {
    if (this._store.value[stateName]) {
      return;
    }
    this._store.value[stateName] = initialState;
    this._store.next(this._store.value);
    this.dispatch({ type: `registerState(${stateName})` });
    var emitState = (state: M) => {
      if (this._store.value[stateName] != state) {
        this._store.value[stateName] = state;
        this._store.next(this._store.value);
      }
    };
    if (typeof filterActions === "function") {
      this._stateSubscriptions.set(
        stateName,
        this._dispatcher.pipe(filter(filterActions)).subscribe((action) => {
          mapActionToState(this._store.value[stateName], action, emitState);
        })
      );
    } else {
      this._stateSubscriptions.set(
        stateName,
        this._dispatcher.subscribe((action) => {
          mapActionToState(this._store.value[stateName], action, emitState);
        })
      );
    }
  }
  dispatch<V extends Action = Action>(actionName: V): AjwahStore;
  dispatch(actionName: string): AjwahStore;
  dispatch(actionName: string, payload?: any): AjwahStore;
  dispatch(actionName: string | Action, payload?: any): AjwahStore {
    if (typeof actionName === "object") {
      this._dispatcher.next(actionName);
      return this;
    }
    this._dispatcher.next({ type: actionName, payload });
    return this;
  }

  select<T = any>(pathOrMapFn: ((state: S) => any) | string): Observable<T> {
    let mapped$;
    if (typeof pathOrMapFn === "string") {
      mapped$ = this._store.pipe(pluck(pathOrMapFn));
    } else if (typeof pathOrMapFn === "function") {
      mapped$ = this._store.pipe(map((source: any) => pathOrMapFn(source)));
    } else {
      throw new TypeError(
        `Unexpected type '${typeof pathOrMapFn}' in select operator,` +
          ` expected 'string' or 'function'`
      );
    }
    return mapped$.pipe(distinctUntilChanged());
  }

  registerEffect(
    callback: (action$: Actions, store: AjwahStore) => Observable<Action>,
    effectKey: string
  ): void {
    if (this._effectSubscriptions.has(effectKey)) {
      return;
    }
    this._effectSubscriptions.set(
      effectKey,
      callback(this._actions, this).subscribe((action) => this.dispatch(action))
    );
    this.dispatch({ type: `registerEffect(${effectKey})` });
  }

  unregisterEffect(effectKey: string): void {
    if (this._effectSubscriptions.has(effectKey)) {
      this._effectSubscriptions.get(effectKey)?.unsubscribe();
      this._effectSubscriptions.delete(effectKey);
      this.dispatch({ type: `unregisterEffect(${effectKey})` });
    }
  }

  unregisterState(stateName: string): void {
    if (this._stateSubscriptions.has(stateName)) {
      this._stateSubscriptions.get(stateName)?.unsubscribe();
      this._stateSubscriptions.delete(stateName);
      delete this._store.value[stateName];
      this._store.next(this._store.value);
      this.dispatch({ type: `unregisterState(${stateName})` });
    } else if (this._store.value[stateName]) {
      delete this._store.value[stateName];
      this._store.next(this._store.value);
      this.dispatch({ type: `unregisterState(${stateName})` });
    }
  }

  get dispatcher(): Observable<Action> {
    return this._dispatcher;
  }
  get actions(): Actions {
    return this._actions;
  }
  getValue(): any {
    return this._store.getValue();
  }
  getState<T>(stateName: string): T {
    return this._store.value[stateName];
  }

  exportState(): Observable<any[]> {
    return this._dispatcher.pipe(withLatestFrom(this._store, (t, s) => [t, s]));
  }

  importState(states: any) {
    this._store.next(Object.assign({}, states));
    this.dispatch({ type: "@importState" });
  }

  dispose(): void {
    this._stateSubscriptions.forEach((value, key) => {
      value.unsubscribe();
    });
    this._effectSubscriptions.forEach((value, key) => {
      value.unsubscribe();
    });
    this._stateSubscriptions.clear();
    this._effectSubscriptions.clear();

    this._dispatcher.unsubscribe();
    this._store.unsubscribe();
  }
}
