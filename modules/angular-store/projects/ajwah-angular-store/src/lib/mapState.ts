import { tap, withLatestFrom, ignoreElements } from 'rxjs/operators';
import { Observable } from 'rxjs';

export function mapState(state: any, actionType?: string) {
    return { hasState: true, state: state, type: actionType };
}

export function mapEffectCallback(action$: Observable<any>, state: Observable<any>, callback: (state, action) => any): Observable<any> {
    return action$.pipe(
        withLatestFrom(state),
        tap(arr => callback(arr[1], arr[0])),
        ignoreElements()
    )
}