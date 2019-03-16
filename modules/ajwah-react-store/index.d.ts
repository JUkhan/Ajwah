import { Observable } from 'rxjs';
import { Effect } from './src/decorators/effect';
export interface Action {
    type: string | Symbol;
    payload?: string;
}
export declare class ActionsObservable<T extends Action> extends Observable<T> {

    lift<R extends Action>(operator: Operator<T, R>): ActionsObservable<R>;
    lift<R>(operator: Operator<T, R>): Observable<R>;
    ofType<R extends T = T>(...key: R['type'][]): ActionsObservable<R>;
}
export declare function EffectCallback()
export declare class StoreContext {
    dispatch(action: Action): void
    addState(stateClass): void
    removeState(stateName: string): void
    importState(state: any): void
    select(callback: (state: any) => any): void
    addEffect(callback: (action$: ActionsObservable) => Observable): void
    addEffects(...effectClassType): void
    dispose(): void
}

export declare function setStoreContext({ states: [], effects = [], devTools = undefined })

export declare function ofType<T extends Action, R extends T = T, K extends R['type']= R['type']>(...key: K[]): (source: Observable<T>) => Observable<R>;

export declare function getStore(): StoreContext;
export declare function Action(actionType: string | Symbol): any;
export declare function State({ name, initialState = {} }): any;

export declare function Connect(callback: { [key: string]: (state: any) => any }): any;
export declare function Effect({ dispatch } = { dispatch: true }): any;
