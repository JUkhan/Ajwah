import { BehaviorSubject, Observable, Subscription, merge } from "rxjs";
import { map, distinctUntilChanged, withLatestFrom } from "rxjs/operators";

import { Action } from "./action";
import { dispatch } from "./dispatch";
import { dispatcher } from "./dispatcher";

class RemoteStateAction implements Action<(state: any) => void> {
  constructor(public type: string, public payload: (state: any) => void) {}
}

export abstract class StateController<S> {
  private _store: BehaviorSubject<S>;
  private _sub: Subscription;
  private _effSub?: Subscription;
  constructor(private stateName: string, initialState: S) {
    this._store = new BehaviorSubject<S>(initialState);
    const that = this as any;
    this._sub = dispatcher.subscribe((action) => {
      this.onAction(this.state, action);
      that[action.type]?.call(this, this.state, action);
      if (
        action instanceof RemoteStateAction &&
        action.type === this.stateName
      ) {
        action.payload(this.state);
      }
    });

    dispatch(`@newBornState(${this.stateName})`);
    setTimeout(() => {
      this.onInit();
    }, 0);
  }
  onAction(state: S, action: Action) {}
  onInit() {}

  select<T = any>(mapFn: (state: S) => any): Observable<T> {
    let mapped$;
    if (typeof mapFn === "function") {
      mapped$ = this._store.pipe(map((source: any) => mapFn(source)));
    } else {
      throw new TypeError(
        `Unexpected type '${typeof mapFn}' in select operator,` +
          ` expected 'string' or 'function'`
      );
    }
    return mapped$.pipe(distinctUntilChanged());
  }

  get stream$(): Observable<S> {
    return this._store.pipe(distinctUntilChanged());
  }

  get state() {
    return this._store.value;
  }
  /**
   * This fuction merge the input state with the current store state
   * @param state You can pass partial state.
   *
   */
  emit(state: any) {
    const ps =
      typeof state === "object" ? Object.assign({}, this.state, state) : state;
    this._store.next(ps);
  }
  exportState(): Observable<any[]> {
    return dispatcher.pipe(withLatestFrom(this._store, (t, s) => [t, s]));
  }

  importState(state: S) {
    this._store.next(state);
    dispatch(`@importState(${this.stateName})`);
  }

  remoteState<State>(stateName: string): Promise<State> {
    return new Promise<State>((resolve) => {
      dispatcher.dispatch(
        new RemoteStateAction(stateName, (state) => {
          resolve(state);
        })
      );
    });
  }

  registerEffect(...streams: Observable<Action>[]): void {
    this._effSub?.unsubscribe();
    this._effSub = merge(...streams).subscribe((action: Action) =>
      dispatch(action)
    );
  }

  dispose(): void {
    this._sub.unsubscribe();
    this._effSub?.unsubscribe();
    this._store.complete();
  }
}
