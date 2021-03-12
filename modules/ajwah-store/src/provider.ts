import { StateController } from "./stateController";

const _container: { [key: string]: any } = {};

export function Get<T extends StateController<any>>(
  controllerType: new () => T
): T {
  const fn = controllerType as any;
  if (!fn.key) {
    const obj = new controllerType();
    fn.key = obj.stateName;
    _container[fn.key] = obj;
    return obj;
  }

  if (!_container[fn.key]) {
    _container[fn.key] = new controllerType();
  }
  return _container[fn.key];
}

export function ClearState<T extends StateController<any>>(
  controllerType: new () => T
): boolean {
  const fn = controllerType as any;
  if (_container[fn.key]) {
    delete _container[fn.key];
    return true;
  }
  return false;
}
