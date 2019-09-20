import { tap, withLatestFrom, ignoreElements } from 'rxjs/operators';
export function mapEffectCallback(action$, state, callback) {
    return action$.pipe(
        withLatestFrom(state),
        tap(arr => callback(arr[1], arr[0])),
        ignoreElements()
    );
}
export function mapState(state, actionType) {
    return { hasState: true, state: state, type: actionType };
}