
import { Observable, Operator } from 'rxjs';


interface IAction<T = any> {
    type: string;
    payload?: T;
    [key: string]: any;
}
export declare class Actions<T = IAction> extends Observable<T>{
    lift<R extends IAction>(operator: Operator<T, R>): Actions<R>;
    lift<R>(operator: Operator<T, R>): Observable<R>;
    ofType<R extends T = T>(...key: string[]): Actions<R>;
}

export declare class StoreContext<S = any> {
    dispatch(actionName: IAction): StoreContext;
    dispatch(actionName: string): StoreContext;
    dispatch(actionName: string, payload?: any): StoreContext;
    addState(stateClassType: any): StoreContext;
    removeState(stateName: string): StoreContext;
    removeEffectsByKey(key: string): StoreContext;
    importState(state: any): StoreContext;
    exportState(): Observable<[IAction, S]>;
    select<R = any>(pathOrMapFn: ((state: S) => any) | string, ): Observable<R>;
    addEffect<T extends Actions<IAction>>(callback: (action$: Actions<IAction>, store$?: StoreContext) => Observable<IAction>, key?: string): StoreContext;
    addEffects(effectClassType: any): StoreContext;
    dispose(): void;
}

export declare function setStoreContext(options: { states: any[], effects?: any[], devTools?: any, actionsMethodStartsWith?: string, effectsMethodStartsWith?: string }): void;

export declare function ofType<T extends IAction, R extends T = T, K extends R['type'] = R['type']>(...key: K[]): (source: Observable<T>) => Observable<R>;

export declare function storeCtx<S = any>(): StoreContext<S>;
export declare function Action(actionType: string): any;
export declare function State(options: { name: string, initialState: any }): any;

export declare function Connect(splitedState?: { [key: string]: (state: any) => any }, componentInstance?: any): any;
export declare function Effect(options?: { dispatch: boolean }): any;
export declare function EffectKey(key: string): any;

export function dispatch(actionName: IAction): StoreContext;
export function dispatch(actionName: string): StoreContext;
export function dispatch(actionName: string, payload?: any): StoreContext;


