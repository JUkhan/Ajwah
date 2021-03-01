import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged, filter, map, pluck } from "rxjs/operators";
import { ObserverState } from "./formModel";
import {
  AUTO_FOCUS,
  CHECK_ERROR,
  REFRESH,
  toSingleKey,
  toMultiKeys,
} from "./utility";
import { Actions } from "./actions";
import { Dispatcher } from "./dispatcher";
import { Action } from "./action";

export class FormStateController extends BehaviorSubject<ObserverState> {
  private dispatcher = new Dispatcher("@FORM_INIT");

  constructor(init: any) {
    super({ fields: toSingleKey(init || {}), errors: {} });
  }

  action$ = new Actions(this.dispatcher);

  get __state() {
    return this.value.fields;
  }
  get state() {
    return toMultiKeys(this.value.fields);
  }
  get errorState() {
    return this.value.errors;
  }
  get state$() {
    return this.pipe(pluck("fields"), distinctUntilChanged());
  }

  select(fieldName: string) {
    return this.pipe(
      pluck("fields", fieldName),
      filter((el) => typeof el !== "undefined"),
      distinctUntilChanged()
    );
  }
  emit(fieldName: string, value: any) {
    this.next({
      errors: this.value.errors,
      fields: { ...this.value.fields, [fieldName]: value },
    });
  }
  emitError(key: string, value: any) {
    this.next({
      fields: this.value.fields,
      errors: { ...this.value.errors, [key]: value },
    });
  }
  selectError(fieldName: string) {
    return this.pipe(pluck("errors", fieldName), distinctUntilChanged());
  }
  get hasError$() {
    return this.pipe(
      map((state) => state.errors),
      map((errors) => {
        return (
          Object.entries(errors).filter(([key, value]) => value).length > 0
        );
      })
    );
  }
  isUndefined(fieldName: string) {
    return typeof this.__state[fieldName] === "undefined";
  }
  setState(state: ObserverState) {
    state.fields = toSingleKey(state.fields);
    this.next(state);
  }
  errorMap = new Map<string, boolean>();

  get isValid() {
    return Array.from(this.errorMap.values()).filter((it) => it).length === 0;
  }
  notify(
    fieldName: string,
    args?: {
      value?: any;
      error?: string;
      hasError?: boolean;
      flag?: boolean;
      loading?: boolean;
      data?: any;
    }
  ) {
    this.dispatch({ type: REFRESH, payload: [fieldName, args || {}] });
  }

  reset() {
    Object.keys(this.__state).forEach((key) =>
      this.notify(key, {
        value: "",
        error: "",
        hasError: false,
        loading: false,
        flag: false,
      })
    );
    this.setState({ fields: {}, errors: {} });
    this.dispatch({ type: AUTO_FOCUS });
  }

  validate() {
    this.dispatch(CHECK_ERROR);
  }

  dispatch<V extends Action = Action>(actionName: V): void;
  dispatch(actionName: string): void;
  dispatch(actionName: symbol): void;
  dispatch(actionName: string, payload?: any): void;
  dispatch(actionName: string | Action | symbol, payload?: any): void {
    if (typeof actionName === "object") {
      this.dispatcher.next(actionName);
      return;
    }
    this.dispatcher.next({ type: actionName, payload });
  }
  complete() {
    this.dispatcher.complete();
    super.complete();
  }
}
