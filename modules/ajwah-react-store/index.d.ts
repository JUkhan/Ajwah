
import { Observable, Operator } from 'rxjs';


interface Action {
    type: string;
    payload?: any;
}
export declare class Actions<T = Action> extends Observable<T>{
    lift<R extends Action>(operator: Operator<T, R>): Actions<R>;
    lift<R>(operator: Operator<T, R>): Observable<R>;
    ofType<R extends T = T>(...key: string[]): Actions<R>;
}

export declare class StoreContext {
    dispatch(action: Action): StoreContext;
    addStates(...stateClassTypes: any[]): StoreContext;
    removeStates(...stateNames: string[]): StoreContext;
    removeEffectsByKey(key: string): StoreContext;
    importState(state: any): StoreContext;
    select<T=any>(pathOrMapFn: ((state: T) => any) | string, ): Observable<any>;
    addEffect<T extends Actions<Action>>(callback: (action$: Actions<Action>, store$?: StoreContext) => Observable<Action>, key?: string): StoreContext;
    addEffects(...effectClassTypes: any[]): StoreContext;
    dispose(): void;
}

export declare function setStoreContext(options: { states: any[], effects?: any[], devTools?: any }): void;

export declare function ofType<T extends Action, R extends T = T, K extends R['type']= R['type']>(...key: K[]): (source: Observable<T>) => Observable<R>;

export declare function getStore(): StoreContext;
export declare function Action(actionType: string): any;
export declare function State(options: { name: string, initialState: any }): any;

export declare function Connect(splitedState?: { [key: string]: (state: any) => any }): any;
export declare function Effect(options?: { dispatch: boolean }): any;
export declare function EffectKey(key: string): any;
