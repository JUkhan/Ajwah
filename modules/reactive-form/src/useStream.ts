import { useState, useEffect } from "react";
import { Observable } from "rxjs";
import { StateController } from "./stateController";
import { Get } from "./provider";

export function useStream<S, T extends StateController<any>>(
  controllerType: new () => T,
  stream: (controller: T) => Observable<S>,
  initialState: (controller: T) => S
) {
  const state = useState(initialState(Get(controllerType)));
  useEffect(() => {
    const sub = stream(Get(controllerType)).subscribe((res) => {
      state[1](res);
    });
    return () => {
      sub?.unsubscribe();
    };
  }, [controllerType]);

  return state;
}
