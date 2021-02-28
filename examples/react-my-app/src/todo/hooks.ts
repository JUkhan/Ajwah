import { useEffect, useState } from "react";
import { Observable } from "rxjs";

export function useStream<T>(
  stream$: Observable<T>,
  initialState: T
): [T, any] {
  const [state, setState] = useState<T>(initialState);
  useEffect(() => cleanupSubscriptions(setState, stream$), []);
  return [state, setState];
}

function cleanupSubscriptions<T>(
  setState: (state: T) => void,
  stream$: Observable<T>
) {
  const sub = stream$.subscribe(res => {
    setState(res);
  });
  return function() {
    sub.unsubscribe();
  };
}
