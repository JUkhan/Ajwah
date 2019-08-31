import { Actions, Effect, ofType, Action, Store, mapState } from 'ajwah-angular-store';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from './actions';
import { debounceTime, mapTo, map } from 'rxjs/operators';
import { updateObject } from './util';
import { Injectable } from '@angular/core';
import { of, timer } from 'rxjs'


@Injectable()
// @State({
//     name: 'counter',
//     initialState: { count: 101, msg: '' }
// })
class CounterState {
    name = 'counter'
    initialState = { count: 12, msg: '' }

    constructor(private store: Store) {

    }
    //@Action(INCREMENT)
    onInc(state) {
        //return updateObject(state, { count: state.count + 1, msg: '' })
        return { count: state.count + 1, msg: '' }
    }
    //@Action(DECREMENT)
    onDec(state) {
        //return updateObject(state, { count: state.count - 1, msg: '' })
        return { count: state.count - 1, msg: '' }

    }
    onLoading(state) {
        return { count: state.count, msg: 'loading......' }
    }
    //@Action(ASYNC_INCREMENT)
    *onAsyncInc(state, action) {
        //this.store.dispatch({ type: 'Loading' });

        try {
            yield mapState({ count: state.count, msg: 'loading by generator function......' });
            //console.log(allState.counter);
            const nstate = yield this.getData(state.count);
            //console.log(nstate, 'sssss');
            //throw Error('ssssssss')
            yield mapState(nstate);
            //console.log(allState.counter);
            const xstare = yield this.getData(nstate.count)
            yield mapState(xstare)
            //console.log(allState.counter);
            //state.count = 101

        } catch (err) {
            yield mapState({ ...state, msg: err.message })
        }
    }

    getData(num: number) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ count: num + 1, msg: '' })
            }, 1000);
        });
    }

    getData2(num) {
        return timer(1000).pipe(
            map(s => num)
        ).toPromise()
    }

    /*effectForAsyncIncOrDec(action$: Actions) {
        return action$.pipe(
            //ofType(ASYNC_INCREMENT, DECREMENT),
            debounceTime(450),
            mapTo({ type: INCREMENT }))
    }*/



}

export default CounterState;