import { select, Action } from "ajwah-store";
import { useReducer, useEffect } from "react";
import { Subscription } from "rxjs";
import { Observable } from "rxjs";

export function useStreamByStateNames(...states: string[]) {
  const [state, dispatch] = useReducer((state: any, action: Action) => {
    return action.type ? { ...state, [action.type]: action.payload } : state;
  }, {});
  useEffect(() => subscribeForStateName(dispatch, states), []);
  return state;
}
function subscribeForStateName(
  dispatch: (action: Action) => void,
  states: string[]
) {
  var subs = new Subscription();
  states.forEach((stateName) => {
    subs.add(
      select(stateName).subscribe((data: any) => {
        dispatch({ type: stateName, payload: data });
      })
    );
  });
  return function () {
    subs.unsubscribe();
  };
}
export function useStreamBySelect(states: { [key: string]: Observable<any> }) {
  const [state, dispatch] = useReducer((state: any, action: Action) => {
    return action.type ? { ...state, [action.type]: action.payload } : state;
  }, {});
  useEffect(() => subscribeForSelect(dispatch, states), []);
  return state;
}
function subscribeForSelect(
  dispatch: (action: Action) => void,
  states: { [key: string]: Observable<any> }
) {
  var subs = new Subscription();
  Object.keys(states).forEach((key) => {
    subs.add(
      states[key].subscribe((data: any) => {
        dispatch({ type: key, payload: data });
      })
    );
  });
  return function () {
    subs.unsubscribe();
  };
}
