import {dispatcher} from './dispatcher';
import {Action} from './action';

export function dispatch<V extends Action = Action>(actionName: V): void;
export function dispatch(actionName: string): void;
export function dispatch(actionName: symbol): void;
export function dispatch(actionName: string, payload?: any): void;
export function dispatch(actionName: string | Action | symbol, payload?: any): void {
  if (typeof actionName === "object") {
    dispatcher.dispatch(actionName);
    return;
  }
  dispatcher.dispatch({ type: actionName, payload });

}