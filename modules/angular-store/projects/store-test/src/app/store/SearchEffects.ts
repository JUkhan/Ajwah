
import { Effect, Actions, ofType } from 'ajwah-angular-store';
import {
    debounceTime,
    switchMap,
    distinctUntilChanged,
    map, catchError,
    tap
} from 'rxjs/operators';
import { SEARCH_KEYSTROKE, SEARCH_RESULT } from './actions';
import { ajax } from 'rxjs/ajax';
import { EMPTY } from 'rxjs';


export class SearchEffects {

    @Effect()
    search(action$: Actions) {
        return action$.pipe(
            ofType(SEARCH_KEYSTROKE),
            debounceTime(700),
            distinctUntilChanged(),
            switchMap(action => {
                return ajax.getJSON(`https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=${action.payload}&limit=5`).pipe(
                    tap(res => console.log(res)),
                    map(data => ({ type: SEARCH_RESULT, payload: data[1] })),
                    catchError(err => EMPTY)
                )
            })
        )
    }
}
