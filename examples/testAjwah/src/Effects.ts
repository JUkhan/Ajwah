import { Effect, Action, ActionsObservable } from 'ajwah-react-store';
import {
    debounceTime,
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
        return (action$: ActionsObservable<Action>) => action$.ofType(SEARCH_KEYSTROKE).pipe(
            debounceTime(700),
            distinctUntilChanged(),
            switchMap((action: Action) => {
                return ajax.getJSON(`https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=${action.payload}&limit=5`).pipe(
                    tap(res => console.log(res)),
                    map(data => ({ type: SEARCH_RESULT, payload: data[1] }))
                )
            })
        )
    }
}

export default Effects;