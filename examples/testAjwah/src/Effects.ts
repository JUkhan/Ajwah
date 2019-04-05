import { Effect, Actions, StoreContext } from 'ajwah-react-store';
import {
    debounceTime, withLatestFrom,
    switchMap,
    distinctUntilChanged,
    map,
    tap
} from 'rxjs/operators';
import { SEARCH_KEYSTROKE, SEARCH_RESULT } from './actions';
import { ajax } from 'rxjs/ajax';
class Effects {

    @Effect()
    search() {
        return (action$: Actions, store: StoreContext) => action$.ofType(SEARCH_KEYSTROKE).pipe(
            debounceTime(700),
            distinctUntilChanged(),
            //withLatestFrom(store.select('counter')),
            switchMap(action => {
                return ajax.getJSON(`https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=${action.payload}&limit=5`).pipe(
                    tap(res => console.log(res)),
                    map(data => ({ type: SEARCH_RESULT, payload: data[1] }))
                )
            })
        )
    }
}

export default Effects;