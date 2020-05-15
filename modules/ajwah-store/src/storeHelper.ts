import { Store } from "./store";
import { Dispatcher } from "./dispatcher";
import { Observable } from "rxjs";
import { IMPORT_STATE, Action } from "./utils";

export declare function mapActionToState<T>(
  state: T,
  action: Action
): IterableIterator<T> | AsyncIterableIterator<T>;

var store = new Store(new Dispatcher());
export function createStore(options: {
  reducers: any[];
  devTools?: any;
}): Store {
  store.__init__(options.reducers);
  if (options.devTools && options.devTools.run) {
    options.devTools.run({
      store,
      dispatcher: store.dispatcher,
      importState: IMPORT_STATE,
    });
  }
  return store;
}

export function dispatch(actionType: any, payload?: any) {
  store.dispatch(actionType, payload);
}
export function select<T = any>(
  pathOrMapFn: ((state: T) => any) | string
): Observable<any> {
  return store.select(pathOrMapFn);
}
export function addState(stateName: string, reducer: any) {
  store.addState(stateName, reducer);
}

export function removeState(stateName: string) {
  store.removeState(stateName);
}
export function importState(state: any) {
  store.importState(state);
}
export function exportState(): Observable<any[]> {
  return store.exportState();
}
export function currentState<T = any>(): T {
  return store.getValue();
}
