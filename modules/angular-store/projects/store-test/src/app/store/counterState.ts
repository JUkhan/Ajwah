import { Actions, Effect, ofType, Action, Store } from 'ajwah-angular-store';
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
    async onDec(state) {
        //return updateObject(state, { count: state.count - 1, msg: '' })
        return await this.getData()

    }
    //@Action(ASYNC_INCREMENT)
    *onAsyncInc(state) {
        //return updateObject(state, { msg: 'loading...' })

        yield { msg: 'loading...', count: state.count }
        console.log('first')
        yield this.getData();

        //yield { msg: 'second loading...', count: state.count }
        console.log('second')
        this.store.dispatch(INCREMENT);
        yield this.getData();
        console.log('third')
    }

    async getData() {
        return await new Promise(resolve => {
            setTimeout(() => {
                resolve({ count: 20, msg: '' })
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