
import { Observable, Operator } from 'rxjs';


export interface Action {
    type: string | Symbol;
    payload?: string;
}
export declare class ActionsObservable<T extends Action> extends Observable<T> {

    lift<R extends Action>(operator: Operator<T, R>): ActionsObservable<R>;
    lift<R>(operator: Operator<T, R>): Observable<R>;
    ofType<R extends T = T>(...key: R['type'][]): ActionsObservable<R>;
}

export declare class StoreContext {
    dispatch(action: Action): void;
    addState(stateClass: any): void;
    removeState(stateName: string): void;
    removeEffectsByKey(key: string): void;
    importState(state: any): void;
    select<T=any>(pathOrMapFn: ((state: T) => any) | string, ): Observable<any>;
    addEffect<T extends ActionsObservable<Action>>(callback: (action$: ActionsObservable<Action>) => Observable<Action>, key?: string): StoreContext;
    addEffects(...effectClass: any): void;
    dispose(): void;
}

export declare function setStoreContext(options: { states: any[], effects?: any[], devTools?: any }): void;

export declare function ofType<T extends Action, R extends T = T, K extends R['type']= R['type']>(...key: K[]): (source: Observable<T>) => Observable<R>;

export declare function getStore(): StoreContext;
export declare function Action(actionType: string | Symbol): any;
export declare function State(options: { name: string, initialState: any }): any;

export declare function Connect(splitedState?: { [key: string]: (state: any) => any }): any;
export declare function Effect(options?: { dispatch: boolean }): any;
export declare function EffectKey(key: string): any;
