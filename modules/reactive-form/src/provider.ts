import * as React from "react";
import { Observable } from "rxjs";
import { StateController } from "./stateController";

const _container: { [key: string]: any } = {};

export function Get<T extends StateController<any>>(
  controllerType: new () => T
): T {
  if (!_container[controllerType.name]) {
    _container[controllerType.name] = new controllerType();
  }
  return _container[controllerType.name];
}

export function ClearState<T extends StateController<any>>(
  controllerType: new () => T
): boolean {
  if (_container[controllerType.name]) {
    delete _container[controllerType.name];
    return true;
  }
  return false;
}

export function useStream<S, T extends StateController<any>>(
  controllerType: new () => T,
  stream: (controller: T) => Observable<S>,
  initialState: (controller: T) => S
) {
  const state = React.useState(initialState(Get(controllerType)));
  React.useEffect(() => {
    const sub = stream(Get(controllerType)).subscribe((res) => {
      state[1](res);
    });
    return () => {
      sub?.unsubscribe();
    };
  }, [controllerType]);

  return state;
}
