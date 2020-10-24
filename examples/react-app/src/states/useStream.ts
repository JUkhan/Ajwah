import { Observable } from 'rxjs';
import store from "./store";
import { useEffect, useState } from 'react';


export function useStream<T>(stream$: Observable<T>, initialState: T) {
  const [state, setState] = useState<T>(initialState);
  useEffect(() => cleanupSubscriptions(setState, stream$), []);
  return state;
}

export function useStreamByStateName<T>(stateName: string) {
  const [state, setState] = useState<T>(store.getState<T>(stateName));
  useEffect(() => cleanupSubscriptions(setState, store.select<T>(stateName)), []);
  return state;
}

function cleanupSubscriptions<T>(setState: (state: T) => void, stream$: Observable<T>) {
  const sub = stream$.subscribe(res => {
    setState(res);
  })
  return function () {
    sub.unsubscribe();
  };
}
