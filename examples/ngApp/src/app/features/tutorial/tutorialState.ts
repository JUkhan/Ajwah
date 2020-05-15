import { ADD_TUTORIAL, REMOVE_TUTORIAL } from "../../store/actions";
import { Action } from "ajwah-angular-store";
import { updateObject } from "../../store/util";
import { Injectable } from "@angular/core";
import { debounceTime, mapTo } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class TutorialState {
  //@Action(ADD_TUTORIAL)
  actionAddTutorial(state, action) {
    //state.data = [...state.data, action.payload];
    return updateObject(state);
  }

  //@Action(REMOVE_TUTORIAL)
  actionRemoveTutorial(state, action) {
    const data = state.data.filter((_) => _.name !== action.payload);
    return updateObject(state, { data });
  }
}
