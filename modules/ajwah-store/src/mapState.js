import { tap, withLatestFrom, ignoreElements } from 'rxjs/operators';
export function mapState(action$, state, callback) {
    return action$.pipe(
        withLatestFrom(state),
        tap(arr => callback(arr[1], arr[0])),
        ignoreElements()
    );
}