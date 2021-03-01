import { PureComponent } from "react";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { FieldProps, FieldState } from "./formModel";
import { CHECK_ERROR, REFRESH, RESET } from "./utility";

export class Field extends PureComponent<FieldProps, FieldState> {
  subs?: Subscription;
  errorCaught = false;

  constructor(props: FieldProps) {
    super(props);
    const val = this.props.observer.__state[this.props.name];
    this.state = {
      refresh: 0,
      data: [],
      error: "",
      loading: false,
      flag: false,
      hasError: false,
      value: typeof val === "undefined" ? "" : val,
    } as FieldState;
    this.changeValue = this.changeValue.bind(this);
    this.emitError = this.emitError.bind(this);
    this.setFlag = this.setFlag.bind(this);
    this.mapError = this.mapError.bind(this);
    this.setInputRef = this.setInputRef.bind(this);
  }
  componentDidMount() {
    if (typeof this.props.observer === "undefined") {
      throw new Error("observer prop is not defined");
    }
    this.validate(true);
    this.subs?.unsubscribe();
    this.subs = this.props.observer
      .select(this.props.name)
      .pipe(
        tap((res) => {
          if (res !== this.state.value && typeof res !== "undefined") {
            this.setState({ value: res /*, flag: true*/ });
            this.fieldSideEffect(res);
          }
        }),
        debounceTime(250)
      )
      .subscribe(() => {
        if (!this.props.observer.isUndefined(this.props.name)) {
          this.validate();
        }
      });

    this.subs.add(
      this.props.observer.selectError(this.props.name).subscribe((res: any) => {
        if (res !== this.state.error) {
          this.setState({ error: res || "", hasError: !!res });
        }
      })
    );
    this.subs.add(
      this.props.observer.action$.whereType(CHECK_ERROR).subscribe(() => {
        this.validate();
        this.state.flag || this.setFlag(true);
      })
    );

    const debounce =
      typeof this.props.debounce === "number"
        ? this.props.debounce
        : this.props.debounce
        ? 260
        : 0;
    this.subs.add(
      this.props.observer.action$
        .whereType(this.props.name)
        .pipe(debounceTime(debounce), distinctUntilChanged())
        .subscribe((res) => {
          this.props.observer.emit(this.props.name, res.payload);
        })
    );

    this.subs.add(
      this.props.observer.action$
        .where(
          (action) =>
            action.type === REFRESH && action.payload[0] === this.props.name
        )
        .subscribe((res) => {
          this.setState({ refresh: new Date().getTime(), ...res.payload[1] });
          if (typeof res.payload[1].value !== "undefined") {
            this.changeValue(res.payload[1].value);
            this.fieldSideEffect(res.payload[1].value);
          }
        })
    );
    this.subs.add(
      this.props.observer.action$.whereType(RESET).subscribe(() => {
        this.focus();
        this.fieldSideEffect("");
      })
    );
    this.focus();
    if (this.state.value !== "undefined") {
      this.fieldSideEffect(this.state.value);
    }
  }
  //componentDidUpdate(prevProps:FieldProps, prevState) {}

  fieldSideEffect(value: any) {
    this.props.onChange?.call(null, {
      observer: this.props.observer,
      value,
      data: this.state.data,
      elm: this.node,
    });
  }
  focus() {
    if (this.props.autoFocus) {
      this.node?.focus?.call(this.node);
    }
  }
  componentWillUnmount() {
    this.subs?.unsubscribe();
  }
  node: any;
  setInputRef(element: any) {
    this.node = element;
    setTimeout(() => {
      this.focus();
    }, 0);
  }
  emitError(errorMessage?: string) {
    this.errorCaught = !!errorMessage;
    this.props.observer.emitError(this.props.name, errorMessage);
    this.props.observer.errorMap.set(this.props.name, this.errorCaught);
  }
  mapError(errorMessage?: string) {
    this.errorCaught = !!errorMessage;
    this.props.observer.errorMap.set(this.props.name, this.errorCaught);
  }
  validate(notEmit: boolean = false) {
    this.errorCaught = false;
    if (this.props.validators) {
      const callback = notEmit ? this.mapError : this.emitError;
      const validators =
        typeof this.props.validators === "function"
          ? this.props.validators(this.props.observer.state)
          : this.props.validators;
      if (
        typeof this.props.validators === "function" &&
        validators.length === 0
      ) {
        callback("");
      }
      for (let i = 0; i < validators.length; i++) {
        if (this.errorCaught) break;
        validators[i]({
          value: this.state.value,
          emitError: callback,
          values: this.props.observer.__state,
        });
      }
    }
    this.errorCaught = false;
  }

  changeValue(value: any) {
    this.props.observer.dispatch({ type: this.props.name, payload: value });
  }
  setFlag(flag: boolean) {
    this.setState({ flag });
  }
  render() {
    const { value, hasError, error, flag, loading, data } = this.state;
    return this.props.render({
      value,
      hasError,
      error,
      flag,
      loading,
      setFlag: this.setFlag,
      setValue: this.changeValue,
      setRef: this.setInputRef,
      data,
    });
  }
}
