import { useState, useEffect } from "react";
import { Observable } from "rxjs";
import { StateController } from "./stateController";
import { Get } from "./provider";

export interface StreamResponse<S> {
  data: S;
  loading: boolean;
  error: any;
}
export function useStream<S, T extends StateController<any>>(
  controllerType: new () => T,
  stream: (controller: T) => Observable<S>,
  initialState?: (controller: T) => S
) {
  const state = useState<StreamResponse<S>>({
    loading: typeof initialState === "function" ? false : true,
    data:
      typeof initialState === "function"
        ? initialState(Get(controllerType))
        : (null as any),
    error: null,
  });

  useEffect(() => {
    const sub = stream(Get(controllerType)).subscribe(
      (res) => {
        state[1]({ loading: false, data: res, error: null });
      },
      (error) => state[1]({ loading: false, error, data: null as any })
    );
    return () => {
      sub?.unsubscribe();
    };
  }, [controllerType]);

  return state;
}
