

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
    onSetDatax(state, { payload }) {
        console.log({ ...state, payload })
        return { ...state, ...payload }
    }



    *onAsyncInc(state, action) {
        yield mapState({ ...state, msg: 'loading...' }, 'loading');
        state = yield mapState(yield this.getData(state.count), 'Inc1');
        yield mapState(yield this.getData(state.count), 'Inc2');

    }
    xeffectForAsyncInc(action$: Actions) {
        return action$.pipe(
            debounceTime(555),
            tap(console.log),
            mapTo({ type: 'Inc' })
        )
    }

    async dddd(state, action) {
        console.log(state, action)
        const data: any = await this.getData(state.count);
        this.store.dispatch('Inc', data.count);

    }

}

export default CounterState;