import { BehaviorSubject, Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { Action } from "./action";

///used for making effects applying filters on action type(s).
///
///**Example**
///```dart
///Stream<Action> effectForAsyncInc(Actions action$, Store store$) {
///    return action$
///        .whereType(ActionTypes.AsyncInc)
///        .debounceTime(Duration(milliseconds: 550))
///        .mapTo(Action(type: ActionTypes.Inc));
///  }
///```
export class Actions {
  constructor(private _dispatcher: BehaviorSubject<Action>) {}

  ///This function takes **String actionType** param
  ///and apply filter on actionType and return Stream<Action>
  whereType(actionType: string): Observable<Action> {
    return this._dispatcher.pipe(filter((action) => action.type == actionType));
  }

  //This function takes **List<String> actionTypes** param
  //and apply filter on actionTypes and return Stream<Action>
  whereTypes(actionTypes: string[]): Observable<Action> {
    return this._dispatcher.pipe(
      filter((action) => actionTypes.includes(action.type))
    );
  }
}
