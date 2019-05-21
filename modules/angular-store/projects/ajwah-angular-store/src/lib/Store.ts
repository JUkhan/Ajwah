
import { BehaviorSubject, Subscription, Observable, queueScheduler } from 'rxjs';
import { map, scan, distinctUntilChanged, pluck, subscribeOn, withLatestFrom } from 'rxjs/operators';
import { combineStates } from './combineStates';
import { Dispatcher } from './dispatcher';
import { Injectable, Injector, Type, OnDestroy } from '@angular/core';
import { STATE_METADATA_KEY, EFFECT_METADATA_KEY, IMPORT_STATE } from './tokens';
import { EffectsSubscription } from './effectsSubscription';

import { IAction } from './model'
import { copyObj } from './utils';

@Injectable()
export class Store<S = any> extends BehaviorSubject<any> implements OnDestroy {
    private subscriptionMap;
    private states;
    private storeSubscription: Subscription;
    constructor(
        private dispatcher: Dispatcher,
        private effect: EffectsSubscription,
        private injector: Injector
    ) {
        super({});
        this.subscriptionMap = {};
        this.states = {};
    }

    __init__(initStates: any, initEffects: any) {
        for (let state of initStates) {
            this.mapState(state);
        }
        this.storeSubscription = this.dispatcher.pipe(
            subscribeOn(queueScheduler),
            scan(((state, action: any) => action.type === IMPORT_STATE ? action.payload : combineStates(state, action, this.states)), {}))
            .subscribe((newState => { super.next(newState); }));

        this.effect.addEffects(initStates);
        if (initEffects.length)
            this.effect.addEffects(initEffects);

    }

    dispatch<V extends IAction = IAction>(actionName: V): Store;
    dispatch(actionName: string): Store;
    dispatch(actionName: string, payload?: any): Store;
    dispatch(actionName: string | IAction, payload?: any): Store {
        if (typeof actionName === 'object') {
            this.dispatcher.next(actionName);
            return;
        }
        this.dispatcher.next({ type: actionName, payload });
        return this;
    }


    select<T = any>(pathOrMapFn: ((state: S) => any) | string): Observable<T> {

        let mapped$;
        if (typeof pathOrMapFn === 'string') {
            mapped$ = this.pipe(pluck(pathOrMapFn));
        }
        else if (typeof pathOrMapFn === 'function') {
            mapped$ = this.pipe(map(((source: any) => pathOrMapFn(source))));
        }
        else {
            throw new TypeError(`Unexpected type '${typeof pathOrMapFn}' in select operator,` +
                ` expected 'string' or 'function'`);
        }
        return mapped$.pipe(distinctUntilChanged());
    }

    next(action: IAction) {
        this.dispatcher.next(action);
    }

    error(error) {
        this.dispatcher.error(error);
    }

    complete() {
        this.dispatcher.complete();
    }

    ngOnDestroy() {
        this.storeSubscription.unsubscribe();
        this.complete();
        Object.keys(this.subscriptionMap).forEach(this.removeEffectsByKey);
    }

    addState(stateClassType: Type<any>): Store {
        const instance = this.injector.get(stateClassType);
        const name = this.mapState(instance);
        this.addEffectsByKey(instance, name);
        this.next({ type: `add_state(${name})` });
        return this;
    }

    removeState(stateName): Store {
        if (this.states[stateName]) {
            delete this.states[stateName];
            this.removeEffectsByKey(stateName);
            this.next({ type: `remove_state(${stateName})` });
        }
        return this;
    }

    private mapState(instance) {
        const meta = instance[STATE_METADATA_KEY];
        this.states[meta.name] = instance;
        return meta.name;
    }

    importState(state) {
        Object.keys(this.states).forEach((key) => {
            if (!state[key]) {
                const metaProp = this.states[key][STATE_METADATA_KEY];
                const initData = copyObj(metaProp.initialState);
                state[key] = initData;
            }
        });
        this.next({ type: IMPORT_STATE as any, payload: state });
    }
    exportState(): Observable<[IAction, S]> {
        return this.dispatcher.pipe(
            withLatestFrom(this),
            map(arr => {
                arr[1] = copyObj(arr[1]);
                return arr;
            })
        );
    }

    addEffects(effectClassType: Type<any>): Store {
        const inst = this.injector.get(effectClassType);
        const key = inst[EFFECT_METADATA_KEY].key;
        if (key) {
            this.removeEffectsByKey(key);
            this.addEffectsByKey(inst, key);
        } else {
            this.effect.addEffects([inst]);
        }
        return this;

    }

    removeEffectsByKey(key: string): Store {
        if (this.subscriptionMap[key]) {
            this.subscriptionMap[key].unsubscribe();
            this.subscriptionMap[key] = undefined;
        }
        return this;
    }

    private addEffectsByKey(instance, key) {
        this.effect.addEffectsByKey(instance, this.subscriptionMap[key] || (this.subscriptionMap[key] = new Subscription()));
    }
    addFeatureEffects(effects: any[]) {
        for (let instance of effects) {
            const key = instance[EFFECT_METADATA_KEY].key;
            if (key) {
                this.removeEffectsByKey(key);
                this.addEffectsByKey(instance, key);
            }
            else {
                this.effect.addEffects([instance]);
            }
        }
    }
    removeFeatureEffects(effects: any[]) {
        for (let instance of effects) {
            const key = instance[EFFECT_METADATA_KEY].key;
            if (key) {
                this.removeEffectsByKey(key);
            }
        }
    }
    addFeatureStates(featureStates: any[]) {
        for (let state of featureStates) {
            const name = this.mapState(state);
            this.removeEffectsByKey(name);
            this.addEffectsByKey(state, name);
            this.next({ type: `add_state(${name})` });
        }
    }
    removeFeatureStates(featureStates: any[]) {
        for (let state of featureStates) {
            this.removeState(state.name);
            this.next({ type: `remove_state(${state.name})` });
        }
    }
}
