import { BehaviorSubject } from "rxjs";
import { filter } from "rxjs/operators";
import { Action } from "./action";
import { dispatcher } from "./dispatcher";

export class Actions {
  constructor(private _dispatcher: BehaviorSubject<Action>) {}

  whereType(actionType: any) {
    return this._dispatcher.pipe(
      filter((action) => action.type === actionType)
    );
  }

  whereTypes(...actionTypes: any[]) {
    return this._dispatcher.pipe(
      filter((action) => actionTypes.includes(action.type))
    );
  }
  where(predicate: (action: Action) => boolean) {
    return this._dispatcher.pipe(filter(predicate));
  }
}

export const action$ = new Actions(dispatcher);
