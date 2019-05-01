
import { storeCtx } from 'ajwah-store';
import { useReducer, useEffect } from 'react';
import { Subscription } from 'rxjs'

export function useSubscriptions(states) {
    const [state, dispatch] = useReducer((state, action) => {
        return action.type ? { ...state, [action.type]: action.payload } : state
    }, states.reduce((prev, next) => { prev[next] = storeCtx().store.states[next] ? storeCtx().store.states[next]['ajwah/state'].initialState : {}; return prev; }, {}));
    useEffect(() => cleanupSubscriptions(dispatch, states), []);
    return state;
}

function cleanupSubscriptions(dispatch, states) {
    var subs = new Subscription();
    states.forEach(stateName => {
        subs.add(storeCtx().select(stateName).subscribe(data => {
            dispatch({ type: stateName, payload: data })
        }));
    });
    return function () {
        subs.unsubscribe();
    };
}