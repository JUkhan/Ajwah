import { BehaviorSubject, queueScheduler } from 'rxjs';
import { map, scan, distinctUntilChanged, pluck, observeOn } from 'rxjs/operators';
import { combineStates } from './combineStates';
import { STATE_METADATA_KEY } from './tokens';
import { copyObj } from './utils';

export class Store extends BehaviorSubject {

    constructor(initStates, dispatcher) {
        super({});
        this.states = {};

        for (let state of initStates) {
            this._mapState(state);
        }
        this.dispatcher = dispatcher;

        this.subscription = this.dispatcher.pipe(
            observeOn(queueScheduler),
            scan((state, action) => action.type === '@@importState' ? action.payload : combineStates(state, action, this.states), {})
        ).subscribe(newState => { super.next(newState); });

    }
    dispatch(action) {
        this.dispatcher.next(action);
    }

    select(pathOrMapFn) {

        let mapped$;

        if (typeof pathOrMapFn === 'string') {
            mapped$ = this.pipe(pluck(pathOrMapFn));
        } else if (typeof pathOrMapFn === 'function') {
            mapped$ = this.pipe(
                map(source => pathOrMapFn(source))
            );
        } else {
            throw new TypeError(
                `Unexpected type '${typeof pathOrMapFn}' in select operator,` +
                ` expected 'string' or 'function'`
            );
        }

        return mapped$.pipe(distinctUntilChanged());
    }
    next(action) {
        this.dispatcher.next(action);
    }
    error(error) {
        this.dispatcher.error(error)
    }
    complete() {
        this.dispatcher.complete();
    }
    dispose() {
        this.subscription.unsubscribe();
        this.complete();
    }
    addState(stateClass) {
        const name = this._mapState(stateClass)
        this.next({ type: `add_state(${name})` });

    }
    removeState(stateName) {
        if (!this.states[stateName]) {
            console.error(`Unknown state name '${stateName}'`);
            return;
        }

        delete this.states[stateName];
        this.next({ type: `remove_state(${stateName})` });
    }
    _mapState(inst) {
        const meta = inst[STATE_METADATA_KEY];
        if (!meta.name) {
            meta.name = inst.name;
        }
        if (!meta.initialState) {
            meta.initialState = inst.initialState;
        }
        this.states[meta.name] = inst;
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
        this.next({ type: '@@importState', payload: state });
    }
}
