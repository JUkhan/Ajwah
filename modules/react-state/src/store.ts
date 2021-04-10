import { BehaviorSubject, Subscription } from "rxjs";

import { Action } from "./action";

export interface RegisterState<M = any> {
  stateName: string;
  initialState: M;
  mapActionToState: (
    state: M,
    action: Action,
    emit: (state: M) => void
  ) => void;
}

const dispatcher = new BehaviorSubject<Action>({ type: "@INIT" });

export function dispatch<V extends Action = Action>(actionName: V): void;
export function dispatch(actionName: string): void;
export function dispatch(actionName: string, payload?: any): void;
export function dispatch(actionName: string | Action, payload?: any): void {
  if (typeof actionName === "object") {
    dispatcher.next(actionName);
  }
  dispatcher.next({ type: actionName, payload });
}
export class MonoStore<S = any> {
  private _store: BehaviorSubject<any>;
  private _stateSubscriptions: Map<String, Subscription>;

  constructor(states: RegisterState[]) {
    this._store = new BehaviorSubject<any>({});
    this._stateSubscriptions = new Map<String, Subscription>();
    states.forEach((s) => {
      this.registerState(s);
    });
  }
  registerState<M>({
    stateName,
    initialState,
    mapActionToState,
  }: RegisterState<M>): void {
    if (this._store.value[stateName]) {
      return;
    }
    this._store.value[stateName] = initialState;

    dispatch({ type: `registerState(${stateName})` });
    const emitState = (state: M) => {
      if (this._store.value[stateName] !== state) {
        this._store.value[stateName] = state;
        this._store.next(Object.assign({}, this._store.value));
      }
    };

    this._stateSubscriptions.set(
      stateName,
      dispatcher.subscribe((action) => {
        mapActionToState(this._store.value[stateName], action, emitState);
      })
    );
  }

  get value(): any {
    return this._store.value;
  }
  select() {
    return this._store;
  }
  dispose(): void {
    this._stateSubscriptions.forEach((value, key) => {
      value.unsubscribe();
    });
    this._store.unsubscribe();
  }
}
export function createStore(states: RegisterState[]) {
  return new MonoStore(states);
}
