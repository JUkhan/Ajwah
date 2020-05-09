export interface BaseState<T = any> {
  stateName: string;
  initState: T;
  mapActionToState(state: T, action: Action): any;
}
export interface Action<T = any> {
  type: any;
  payload?: T;
}
