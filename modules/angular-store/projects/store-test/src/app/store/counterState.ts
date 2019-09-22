

import { Actions, Effect, ofType, Action, Store, mapState } from 'ajwah-angular-store';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from './actions';
import { debounceTime, mapTo, map, flatMap, withLatestFrom, tap, ignoreElements } from 'rxjs/operators';
import { updateObject } from './util';
import { Injectable } from '@angular/core';
import { of, timer, from, Observable } from 'rxjs'


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
        console.log('---loading----')
        return { ...state, msg: 'loading......' }
    }
    //@Action(ASYNC_INCREMENT)
    //@Action(ASYNC_INCREMENT)
    *onAsyncInc(state, action) {
        yield mapState({ count: state.count, msg: 'loading by generator function...' }, 'loading');
        //state = yield this.getData(state.count);
        yield mapState(yield this.getData(state.count), 'inc');
    }

    /*@Effect()
    asyncInc$=this.action$.pipe(
            ofType(ASYNC_INCREMENT),
            debounceTime(450),
            mapTo({ type: INCREMENT })
        )*/

    getData(num: number): Promise<any> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ count: num + Math.floor(Math.random() * 15), msg: '' })
            }, 1000)
        })
    }

}

export default CounterState;