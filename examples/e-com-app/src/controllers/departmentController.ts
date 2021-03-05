import { tap } from "rxjs/operators";
import { Action, StateController, action$ } from "ajwah-reactive-form";
import { get } from "../api";
import { DepartmentState } from "../models";
import { actionType as at } from "../models";

export class DepartmentController extends StateController<DepartmentState> {
  constructor() {
    super("department", { deparments: [] });
  }
  onInit() {
    get("departments").subscribe((res) => this.emit({ deparments: res }));
  }

  selectDepartment(state: DepartmentState, action: Action) {
    this.emit({ selectedDepartment: action.payload } as DepartmentState);
  }
}
