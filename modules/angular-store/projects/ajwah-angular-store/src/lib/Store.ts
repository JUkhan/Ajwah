
import { BehaviorSubject, Subscription, Observable, queueScheduler } from 'rxjs';
import { map, scan, distinctUntilChanged, pluck, subscribeOn, withLatestFrom } from 'rxjs/operators';
import { combineStates } from './combineStates';
import { Dispatcher } from './dispatcher';
import { Injectable, Inject, Injector, Type, OnDestroy } from '@angular/core';
import { ROOT_STATES, ROOT_EFFECTS, STATE_METADATA_KEY, EFFECT_METADATA_KEY, IMPORT_STATE } from './tokens';
import { EffectsSubscription } from './effectsSubscription';
import { setActionsAndEffects } from './decorators/altdecoretors';
import { Action } from './model'
import { copyObj } from './utils';

@Injectable()
export class Store extends BehaviorSubject<any> implements OnDestroy {
    private subscriptionMap;
    private states;
    private storeSubscription: Subscription;
    constructor(
        @Inject(ROOT_STATES) initStates,
        private dispatcher: Dispatcher,
        private effect: EffectsSubscription,
        private injector: Injector,
        @Inject(ROOT_EFFECTS) initEffects) {
        super({});
        this.subscriptionMap = {};
        this.states = {};
        for (let state of initStates) {
            this.mapState(state);
        }
        this.storeSubscription = this.dispatcher.pipe(
            subscribeOn(queueScheduler),
            scan(((state, action: any) => action.type === IMPORT_STATE ? action.payload : combineStates(state, action, this.states)), {}))
            .subscribe((newState => { super.next(newState); }));

        this.effect.store = this;
        this.effect.addEffects(initStates);
        if (initEffects.length)
            this.effect.addEffects(initEffects);
    }
    dispatch(actionName: Action): void;
    dispatch(actionName: string): void;
    dispatch(actionName: string, payload?: any): void;
    dispatch(actionName: string | Action, payload?: any): void {
        if (typeof actionName === 'object') {
            this.dispatcher.next(actionName);
            return;
        }
        this.dispatcher.next({ type: actionName, payload });
    }


    select<T = any>(pathOrMapFn: ((state: T) => any) | string): Observable<any> {

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

    next(action: Action) {
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

    addStates(...states: Type<any>[]): Store {
        const instances = states.map(_ => {
            setActionsAndEffects(_);
            return this.injector.get(_);
        });
        instances.forEach((instance => {
            const name = this.mapState(instance);
            this.addEffectsByKey(instance, name);
            this.next({ type: `add_state(${name})` });
        }));
        return this;
    }

    removeStates(...stateNames: string[]): Store {
        for (let stateName of stateNames) {
            if (!this.states[stateName]) {
                console.error(`Unknown state name '${stateName}'`);
                return this;
            }
            delete this.states[stateName];
            this.removeEffectsByKey(stateName);
            this.next({ type: `remove_state(${stateName})` });
        }
        return this;
    }

    private mapState(instance) {
        const meta = instance[STATE_METADATA_KEY];
        if (!meta.name) {
            meta.name = instance.name;
        }
        if (!meta.initialState) {
            meta.initialState = instance.initialState;
        }
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
    exportState(): Observable<any[]> {
        return this.dispatcher.pipe(
            withLatestFrom(this),
            map(arr => {
                arr[1] = copyObj(arr[1]);
                return arr;
            })
        );
    }

    addEffects(...effects: Type<any>[]): Store {

        const instances = effects.map(_ => {
            setActionsAndEffects(_, false);
            const inst = this.injector.get(_);
            if (inst.effectKey) {
                inst[EFFECT_METADATA_KEY].key = inst.effectKey;
            }
            return inst;
        });

        const globalEffects = instances.filter(ef => !ef[EFFECT_METADATA_KEY].key);

        const keysEffects = instances.filter(ef => !!ef[EFFECT_METADATA_KEY].key);
        globalEffects.length && this.effect.addEffects(globalEffects);
        if (keysEffects.length) {
            keysEffects.forEach((instance => {
                const key = instance[EFFECT_METADATA_KEY].key;
                this.addEffectsByKey(instance, key);
            }));
        }

        return this;

    }

    removeEffectsByKey(key: string) {
        if (this.subscriptionMap[key]) {
            this.subscriptionMap[key].unsubscribe && this.subscriptionMap[key].unsubscribe();
            this.subscriptionMap[key] = undefined;
        } else {
            throw `Unknown effect key '${key}'`;
        }
    }

    private addEffectsByKey(instance, key) {
        this.effect.addEffectsByKey(instance, this.subscriptionMap[key] || (this.subscriptionMap[key] = new Subscription()));
    }
}
