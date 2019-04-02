import { BehaviorSubject } from 'rxjs';
import { map, scan, distinctUntilChanged, debounceTime, take, pluck } from 'rxjs/operators';
import { combineStates } from './combineStates';
import { STATE_METADATA_KEY } from './decorators/state';

export class Store extends BehaviorSubject {

    constructor(initStates, dispatcher) {
        super({});
        this.states = {};

        for (let state of initStates) {
            this._mapState(state);
        }
        this.dispatcher = dispatcher;
        this.dispatcher.pipe(
            scan((state, action) => combineStates(state, action, this.states), {})
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
        this.pipe(
            debounceTime(100),
            take(1)
        ).subscribe(() => {
            delete this.states[stateName];
            this.next({ type: `remove_state(${stateName})` });
        });

    }
    _mapState(inst) {
        const meta = inst[STATE_METADATA_KEY];
        this.states[meta.name] = inst;
        return meta.name;
    }
    importState(state) {
        super.next(state);
    }
}
