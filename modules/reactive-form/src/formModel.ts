import { FormStateController } from "./formStateController";
import { Validator, FiledChange } from "./validators";

export interface ObserverState {
  fields: any;
  errors: any;
}

export interface SubmitProps {
  observer: FormStateController;
  render(valid: boolean, formData?: any): any;
}
export interface SubmitState {
  valid: boolean;
  formData: any;
}
type FieldRender = {
  value: any;
  hasError: boolean;
  error: string;
  flag: boolean;
  setFlag: (value: boolean) => void;
  setValue: (value: any) => void;
  loading: boolean;
  setRef: (element: any) => void;
  data: any;
};
type ValidatorsBuilder = (state: any) => Validator[];

export interface FieldProps {
  name: string;
  observer: FormStateController;
  render: (args: FieldRender) => any;
  validators?: Validator[] | ValidatorsBuilder;
  debounce?: boolean | number;
  autoFocus?: boolean;
  onChange?: (args: FiledChange) => void;
}
export interface FieldState {
  value: any;
  error: string;
  hasError: boolean;
  flag: boolean;
  refresh: number;
  loading: boolean;
  data: any;
}
type FormRender = {
  handleSubmit: (e: any) => void;
  observer: FormStateController;
};
export type FormProps = {
  initialValues?: any;
  onSubmit?: (values: any, observer?: FormStateController) => void;
  render: (args: FormRender) => any;
  consumeErrors?: (errors: any) => void;
  consumeState?: (errors: any) => void;
};
