import {
  Action,
  StateController,
  action$,
  dispatch,
} from "ajwah-reactive-form";
import { from } from "rxjs";
import {
  map,
  switchMap,
  tap,
  debounceTime,
  distinctUntilChanged,
  mergeMap,
  exhaustMap,
} from "rxjs/operators";
import { get } from "../api";
import {
  ProductState,
  actionType as at,
  CategoryState,
  DepartmentState,
} from "../models";

export class ProductController extends StateController<ProductState> {
  constructor() {
    super("product", {
      pageNo: 1,
      pageSize: 10,
      rows: [],
      total: 0,
      loading: false,
    });
  }

  onInit() {
    this.effects();
    dispatch(at.LoadProduct);
  }

  onAction(state: ProductState, action: Action) {
    console.log(action);
  }

  pageChange(state: ProductState, action: Action) {
    this.emit({
      pageNo: action.payload.pageNo,
      pageSize: action.payload.pageSize,
      loading: true,
    } as ProductState);
  }

  setProducts(state: ProductState, action: Action) {
    this.emit({
      rows: action.payload.rows,
      total: action.payload.count,
      loading: false,
    });
  }

  effects() {
    this.registerEffect(
      //load products

      action$
        .whereTypes(
          at.SelectDepartment,
          at.SelectCategory,
          at.LoadProduct,
          at.PageChange
        )
        .pipe(
          tap(() => this.emit({ loading: true })),
          map(async (action) => {
            const { pageNo, pageSize } = this.state;

            const {
              selectedDepartment,
            } = await this.remoteState<DepartmentState>("department");
            const { selectedCategory } = await this.remoteState<CategoryState>(
              "category"
            );

            let path = `?page=${pageNo}&limit=${pageSize}&description_length=80`;
            switch (action.type) {
              case at.LoadProduct:
                path = `products` + path;
                break;
              case at.PageChange:
                if (selectedDepartment)
                  path =
                    `products/inDepartment/${selectedDepartment.department_id}` +
                    path;
                else path = `products` + path;
                break;
              case at.SelectDepartment:
                path =
                  `products/inDepartment/${selectedDepartment?.department_id}` +
                  path;
                break;
              case at.SelectCategory:
                path =
                  `products/inCategory/${selectedCategory?.category_id}` + path;
                break;
            }

            return path;
          }),
          mergeMap((path) => from(path)),
          exhaustMap((path) => get(path)),
          map((data) => ({ type: at.SetProducts, payload: data }))
        ),
      //search product
      action$.whereType(at.ProductSearching).pipe(
        debounceTime(450),
        distinctUntilChanged(),
        tap(() => this.emit({ loading: true })),
        switchMap((action) => {
          const { pageNo, pageSize } = this.state;
          const path = action.payload
            ? `products/search?page=${pageNo}&limit=${pageSize}&query_string=${action.payload}&description_length=80`
            : `products?page=${pageNo}&limit=${pageSize}&description_length=80`;
          return get(path);
        }),
        map((data) => ({ type: at.SetProducts, payload: data }))
      )
    );
  }
}
