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
        return { count: state.count, msg: 'loading......' }
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
    async onAsyncInc(state, action) {
        // yield mapState({ ...state, msg: 'loading...' });
        this.store.dispatch('SetDatax', { msg: 'loading...' })
        const data = await this.getData(state.count);
        //yield mapState(data);
        //this.store.dispatch('SetDatax', data);
        return data;
    }
    /*effectForAsyncInc(action$: Actions) {
        return mapState(action$, this.store.select('counter'), this.dddd.bind(this));
    }*/

    async dddd(state, action) {
        console.log(state, action)
        const data: any = await this.getData(state.count);
        this.store.dispatch('Inc', data.count);

    }

}

export default CounterState;