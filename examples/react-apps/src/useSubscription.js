import { select } from "test-store";
import { useReducer, useEffect } from "react";
import { Subscription } from "rxjs";

export function useSubscription(states) {
  const [state, dispatch] = useReducer(
    (state, action) => {
      return action.type ? { ...state, [action.type]: action.payload } : state;
    },
    /*states.reduce((prev, next) => {
      prev[next] = store().store.states[next]
        ? store().store.states[next]["ajwah/state"].initialState
        : {};
      return prev;
    }, {})*/
    {}
  );
  useEffect(() => cleanupSubscriptions(dispatch, states), []);
  return state;
}
export function useSubscription2(states) {
  const [state, dispatch] = useReducer((state, action) => {
    return action.type ? { ...state, [action.type]: action.payload } : state;
  }, {});
  useEffect(() => cleanupSubscriptions2(dispatch, states), []);
  return state;
}

function cleanupSubscriptions(dispatch, states) {
  var subs = new Subscription();
  states.forEach((stateName) => {
    subs.add(
      select(stateName).subscribe((data) => {
        dispatch({ type: stateName, payload: data });
      })
    );
  });
  return function () {
    subs.unsubscribe();
  };
}
function cleanupSubscriptions2(dispatch, states) {
  var subs = new Subscription();
  Object.keys(states).forEach((key) => {
    subs.add(
      states[key].subscribe((data) => {
        dispatch({ type: key, payload: data });
      })
    );
  });
  return function () {
    subs.unsubscribe();
  };
}
