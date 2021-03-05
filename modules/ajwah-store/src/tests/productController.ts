import { Action } from "../action";
import { DepartmentState, DepartmentController } from "./departmentController";

import { StateController } from "../stateController";

import { mergeMap, map } from "rxjs/operators";
import { from } from "rxjs";
import { actions$ } from "../actions";
import { dispatch } from "../dispatch";

export interface Product {
  name: string;
  id: number;
}
export interface ProductStateState {
  products: Product[];
  path?: string;
}
export class ProductController extends StateController<ProductStateState> {
  constructor() {
    super("product", { products: [] });
  }
  onInit() {
    this.effects();
    dispatch("setProduct", {
      products: [
        { name: "pop1", id: 1 },
        { name: "pro2", id: 2 },
        { name: "pro3", id: 3 },
        { name: "pro4", id: 4 },
        { name: "pro5", id: 5 },
      ],
    });
  }
  onAction(state: ProductStateState, action: Action) {
    if (action.type === "setProduct") this.emit(action.payload);
  }

  effects() {
    this.registerEffect(
      actions$.whereTypes("selectDeparment", "selectCategory").pipe(
        map(async (action) => {
          const {
            selectedDepartment,
          } = await this.remoteState<DepartmentState>("department");
          return `product/inDepartment/${selectedDepartment}`;
        }),
        mergeMap((path) => from(path)),
        map((path) => ({
          type: "setProduct",
          payload: {
            path,
            products: [
              { name: "pro2", id: 2 },
              { name: "pro3", id: 3 },
              { name: "pro4", id: 4 },
            ],
          },
        }))
      )
    );
  }

  // async changeDepartment(){
  //     const deptCtrl = await this.remoteController<DepartmentController>('department')
  //     deptCtrl.selectDepartment()
  // }
}
