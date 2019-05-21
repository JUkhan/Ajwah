
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

export declare class Store<S = any> {
    dispatch<V extends IAction = IAction>(actionName: V): Store;
    dispatch(actionName: string): Store;
    dispatch(actionName: string, payload?: any): Store;
    addState(stateClassType: any): Store;
    removeState(stateName: string): Store;
    removeEffectsByKey(key: string): Store;
    importState(state: any): Store;
    exportState(): Observable<[IAction, S]>;
    select<R = any>(pathOrMapFn: ((state: S) => any) | string, ): Observable<R>;
    addEffect<T extends Actions<IAction>>(callback: (action$: Actions<IAction>, store$?: Store) => Observable<IAction>, effectKey: string): Store;
    addEffects(effectClassType: any): Store;
    dispose(): void;
}

export declare function createStore(options: { states: any[], effects?: any[], devTools?: any, actionsMethodStartsWith?: string, effectsMethodStartsWith?: string }): Store;

export declare function ofType<T extends IAction, R extends T = T, K extends R['type'] = R['type']>(...key: K[]): (source: Observable<T>) => Observable<R>;

export declare function store<S = any>(): Store<S>;
export declare function Action(actionType: string): any;
export declare function State(options: { name: string, initialState: any }): any;

export declare function Connect(splitedState?: { [key: string]: (state: any) => any }, componentInstance?: any): any;
export declare function Effect(options?: { dispatch: boolean }): any;
export declare function EffectKey(key: string): any;

export function dispatch(actionName: IAction): Store;
export function dispatch(actionName: string): Store;
export function dispatch(actionName: string, payload?: any): Store;


