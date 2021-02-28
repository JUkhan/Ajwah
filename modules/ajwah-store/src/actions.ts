import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { Action } from "./action";
import {dispatcher} from './dispatcher';

class Actions {
  constructor(private _dispatcher: BehaviorSubject<Action>) { }

  whereType(actionType: string): Observable<Action> {
    return this._dispatcher.pipe(filter((action) => action.type === actionType));
  }

  whereTypes(...actionTypes: string[]): Observable<Action> {
    return this._dispatcher.pipe(
      filter((action) => actionTypes.includes(action.type))
    );
  }
  where(predicate: (action: Action) => boolean): Observable<Action> {
    return this._dispatcher.pipe(filter(predicate));
  }
}

export const actions$ = new Actions(dispatcher);