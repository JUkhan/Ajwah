import { BaseState, Action, Store } from "ajwah-angular-store";
import { Injectable } from "@angular/core";

@Injectable()
export class MargerState implements BaseState {
  stateName: string = "margerState";

  initState: any = { showForm: false, id: "" };

  *mapActionToState(state: any, action: Action): IterableIterator<any> {
    if (action.type === "ShowForm") {
      yield { showForm: true, id: action.payload || "" };
    } else if (action.type === "HideForm") {
      yield { showForm: false, id: action.payload || "" };
    }
  }
}
