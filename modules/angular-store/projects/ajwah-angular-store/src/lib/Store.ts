
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { map, scan, distinctUntilChanged, debounceTime, take, pluck } from 'rxjs/operators';
import { combineStates } from './combineStates';
import { STATE_METADATA_KEY } from './decorators/state';
import { Dispatcher } from './Dispatcher';
import { Injectable, Inject, Injector, Type } from '@angular/core';
import { ROOT_STATES, ROOT_EFFECTS } from './tokens';
import { EffectsSubscription } from './EffectsSubscription';
import { EFFECT_METADATA_KEY } from './decorators/effect';

@Injectable()
export class Store extends BehaviorSubject<any> {
    private _subs;
    private states;
    constructor(
        @Inject(ROOT_STATES) initStates,
        private dispatcher: Dispatcher,
        private effect: EffectsSubscription,
        private injector: Injector,
        @Inject(ROOT_EFFECTS) initEffects) {
        super({});
        this._subs = {};
        this.states = {};
        for (let state of initStates) {
            this._mapState(state);
        }
        this.dispatcher.pipe(
            scan(((state, action) => combineStates(state, action, this.states)), {}))
            .subscribe((newState => { super.next(newState); }));

        this.effect.store = this;
        this.effect.addEffects(initStates);
        if (initEffects.length)
            this.effect.addEffects(initEffects);
    }

    dispatch(action: { type: string, payload?: any }) {
        this.dispatcher.next(action);
    }

    select<T = any>(pathOrMapFn: ((state: T) => any) | string): Observable<any> {

        let mapped$;
        if (typeof pathOrMapFn === 'string') {
            mapped$ = this.pipe(pluck(pathOrMapFn));
        }
        else if (typeof pathOrMapFn === 'function') {
            mapped$ = this.pipe(map((source => pathOrMapFn(source))));
        }
        else {
            throw new TypeError(`Unexpected type '${typeof pathOrMapFn}' in select operator,` +
                ` expected 'string' or 'function'`);
        }
        return mapped$.pipe(distinctUntilChanged());
    }

    next(action: { type: string, payload?: any }) {
        this.dispatcher.next(action);
    }

    error(error) {
        this.dispatcher.error(error);
    }

    complete() {
        this.dispatcher.complete();
    }

    dispose() {
        this.complete();
    }

    addStates(...states: Type<any>[]) {

        const instances = states.map((_ => this.injector.get(_)));
        instances.forEach((instance => {
            const name = this._mapState(instance);
            this.next({ type: `add_state(${name})` });
            this._addEffectsByKey(instance, name);
        }));
    }

    removeState(stateName: string) {
        if (!this.states[stateName]) {
            console.error(`Unknown state name '${stateName}'`);
            return;
        }
        this.pipe(debounceTime(100), take(1)).subscribe((() => {
            delete this.states[stateName];
            this.removeEffectsByKey(stateName);
            this.next({ type: `remove_state(${stateName})` });
        }));
    }

    private _mapState(instance) {
        const meta = instance[STATE_METADATA_KEY];
        this.states[meta.name] = instance;
        return meta.name;
    }

    importState(state) {
        super.next(state);
    }

    addEffects(...effects: Type<any>[]) {

        const instances = effects.map((_ => this.injector.get(_)));

        const globalEffects = instances.filter((ef => !ef[EFFECT_METADATA_KEY].key));

        const keysEffects = instances.filter((ef => !!ef[EFFECT_METADATA_KEY].key));
        globalEffects.length && this.effect.addEffects(globalEffects);
        if (keysEffects.length) {
            keysEffects.forEach((instance => {
                const key = instance[EFFECT_METADATA_KEY].key;
                this._addEffectsByKey(instance, key);
            }));
        }
    }

    removeEffectsByKey(key: string) {
        if (this._subs[key]) {
            this._subs[key].unsubscribe && this._subs[key].unsubscribe();
            this._subs[key] = undefined;
        }
    }

    private _addEffectsByKey(instance, key) {
        this.effect.addEffectsByKey(instance, this._subs[key] || (this._subs[key] = new Subscription()));
    }
}
