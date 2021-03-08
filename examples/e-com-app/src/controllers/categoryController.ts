import { Observable } from "rxjs";
import { StateController, Action, action$ } from "ajwah-reactive-form";
import { Category, CategoryState, actionType as at } from "../models";
import { get } from "../api";

export class CategoryController extends StateController<CategoryState> {
  constructor() {
    super("category", { categories: [] });
  }

  onInit() {
    this.loadCategories();
  }

  selectDepartment(state: CategoryState, action: Action) {
    this.emit({ depertmentId: action.payload.department_id });
  }

  selectCategory(state: CategoryState, action: Action) {
    this.emit({ selectedCategory: action.payload });
  }

  loadCategories() {
    get("categories").subscribe((res: any) => {
      this.emit({ categories: res.rows });
    });
  }

  get categories(): Category[] {
    const { depertmentId, categories } = this.state;
    return depertmentId
      ? categories.filter((c) => c.department_id === depertmentId)
      : categories;
  }
  get menuData$(): Observable<CategoryState> {
    return this.select(
      (state) =>
        ({
          selectedCategory: state.selectedCategory,
          categories: this.categories,
        } as CategoryState)
    );
  }
}
