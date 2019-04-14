
import { Observable, Operator } from 'rxjs';


interface Action {
    type: string;
    [key: string]: any;
}
export declare class Actions<T = Action> extends Observable<T>{
    lift<R extends Action>(operator: Operator<T, R>): Actions<R>;
    lift<R>(operator: Operator<T, R>): Observable<R>;
    ofType<R extends T = T>(...key: string[]): Actions<R>;
}

export declare class StoreContext {
    dispatch(actionName: Action): StoreContext;
    dispatch(actionName: string): StoreContext;
    dispatch(actionName: string, payload?: any): StoreContext;
    addStates(...stateClassTypes: any[]): StoreContext;
    removeStates(...stateNames: string[]): StoreContext;
    removeEffectsByKey(key: string): StoreContext;
    importState(state: any): StoreContext;
    exportState(): Observable<any[]>;
    select<T = any>(pathOrMapFn: ((state: T) => any) | string, ): Observable<any>;
    addEffect<T extends Actions<Action>>(callback: (action$: Actions<Action>, store$?: StoreContext) => Observable<Action>, key?: string): StoreContext;
    addEffects(...effectClassTypes: any[]): StoreContext;
    dispose(): void;
}

export declare function setStoreContext(options: { states: any[], effects?: any[], devTools?: any, actionsMethodStartsWith?: string, effectsMethodStartsWith?: string }): void;
export declare function getStoreContext(options: { states: any[], effects?: any[], devTools?: any, actionsMethodStartsWith?: string, effectsMethodStartsWith?: string }): StoreContext;

export declare function ofType<T extends Action, R extends T = T, K extends R['type'] = R['type']>(...key: K[]): (source: Observable<T>) => Observable<R>;

export declare function getStore(): StoreContext;
export declare function Action(actionType: string): any;
export declare function State(options: { name: string, initialState: any }): any;

export declare function Connect(splitedState?: { [key: string]: (state: any) => any }, componentInstance?: any): any;
export declare function Effect(options?: { dispatch: boolean }): any;
export declare function EffectKey(key: string): any;

export function dispatch(actionName: Action): StoreContext;
export function dispatch(actionName: string): StoreContext;
export function dispatch(actionName: string, payload?: any): StoreContext;
export function subscriptions(mapStore: { [key: string]: (state: any) => void }): () => void;

export declare const AjwahStore: {
    install(Vue: any, options: {
        states: any[];
        effects?: any[];
        devTools?: any;
        actionsMethodStartsWith?: string;
        effectsMethodStartsWith?: string;
        exposeStore?: boolean;
    }): void;
};

