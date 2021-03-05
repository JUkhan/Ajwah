import { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { Observable } from "rxjs";
import { StateController } from "ajwah-reactive-form";
import { get } from "../api";

export function useActionStream<T>(
  stream$: Observable<T>,
  initialState: T
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialState);
  useEffect(() => cleanupSubscriptions(setState, stream$), []);
  return [state, setState];
}
export function usePullData<T>(url: string, initialState: T, ignore?: boolean) {
  const state = useState(initialState);
  useEffect(() => {
    if (ignore) return;
    const sub = get<T>(url).subscribe((res) => {
      state[1](res);
    });
    return function () {
      sub.unsubscribe();
    };
  }, [url]);
  return state;
}

export function useController(controller: StateController<any>) {
  const [state, setState] = useState(1);
  useEffect(() => {
    const sub = controller.stream$.subscribe((res) => {
      setState(new Date().getTime());
    });
    return function () {
      sub.unsubscribe();
    };
  }, []);
  return state;
}

function cleanupSubscriptions<T>(
  setState: (state: T) => void,
  stream$: Observable<T>
) {
  const sub = stream$.subscribe((res) => {
    setState(res);
  });
  return function () {
    sub.unsubscribe();
  };
}

export function useMobileActive(px = 576) {
  const [ma, setAC] = useState(window.innerWidth <= px);
  useEffect(() => {
    let win_resize_handler = () => {
      if (window.innerWidth <= px) setAC(true);
      else setAC(false);
    };
    window.addEventListener("resize", win_resize_handler);
    return () => {
      window.removeEventListener("resize", win_resize_handler);
    };
  }, [ma]);
  return ma;
}
