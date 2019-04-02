
import { Observable, Operator } from 'rxjs';


export interface IAction {
    type: string | Symbol;
    payload?: string;
}
export declare class ActionsObservable<T extends IAction> extends Observable<T> {

    lift<R extends IAction>(operator: Operator<T, R>): ActionsObservable<R>;
    lift<R>(operator: Operator<T, R>): Observable<R>;
    ofType<R extends T = T>(...key: R['type'][]): ActionsObservable<R>;
}

export declare class StoreContext {
    dispatch(action: IAction): void;
    addState(stateClass: any): void;
    removeState(stateName: string): void;
    removeEffectsByKey(key: string): void;
    importState(state: any): void;
    select<T=any>(pathOrMapFn: ((state: T) => any) | string, ): Observable<any>;
    addEffect<T extends ActionsObservable<IAction>>(callback: (action$: ActionsObservable<IAction>) => Observable<IAction>, key?: string): StoreContext;
    addEffects(...effectClass: any): void;
    dispose(): void;
}

export declare function getStoreContext(options: { states: any[], effects?: any[], devTools?: any }): void;

export declare function ofType<T extends IAction, R extends T = T, K extends R['type']= R['type']>(...key: K[]): (source: Observable<T>) => Observable<R>;

//export declare function getStore(): StoreContext;
export declare function Action(actionType: string | Symbol): any;
export declare function State(options: { name: string, initialState: any }): any;

//export declare function Connect(splitedState?: { [key: string]: (state: any) => any }): any;
export declare function Effect(options?: { dispatch: boolean }): any;
export declare function EffectKey(key: string): any;
export declare const AjwahStore: {
    install(Vue: any, options: {
        states: any[];
        effects?: any[];
        devTools?: any;
    }): void;
};

