
import { Observable, Operator } from 'rxjs';


export interface IAction {
    type: string;
    payload?: string;
}
export declare class ActionsObservable<T extends IAction> extends Observable<T> {

    lift<R extends IAction>(operator: Operator<T, R>): ActionsObservable<R>;
    lift<R>(operator: Operator<T, R>): Observable<R>;
    ofType<R extends T = T>(...key: R['type'][]): ActionsObservable<R>;
}

export declare class StoreContext {
    dispatch(action: IAction): StoreContext;
    addStates(...stateClassTypes: any[]): StoreContext;
    removeStates(...stateNames: string[]): StoreContext;
    removeEffectsByKey(key: string): StoreContext;
    importState(state: any): StoreContext;
    select<T=any>(pathOrMapFn: ((state: T) => any) | string, ): Observable<any>;
    addEffect<T extends ActionsObservable<IAction>>(callback: (action$: ActionsObservable<IAction>, store$?: StoreContext) => Observable<IAction>, key?: string): StoreContext;
    addEffects(...effectClassTypes: any[]): StoreContext;
    dispose(): void;
}

export declare function setStoreContext(options: { states: any[], effects?: any[], devTools?: any }): void;

export declare function ofType<T extends IAction, R extends T = T, K extends R['type']= R['type']>(...key: K[]): (source: Observable<T>) => Observable<R>;

export declare function getStore(): StoreContext;
export declare function Action(actionType: string | Symbol): any;
export declare function State(options: { name: string, initialState: any }): any;

export declare function Connect(splitedState?: { [key: string]: (state: any) => any }): any;
export declare function Effect(options?: { dispatch: boolean }): any;
export declare function EffectKey(key: string): any;
