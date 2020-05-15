export interface BaseState<T = any> {
  stateName: string;
  initState: T;
  /**
   *
   * @param state
   * @param action
   * This is a generator function
   *  *mapActionToState(...){}
   */
  mapActionToState(
    state: T,
    action: Action
  ): IterableIterator<T> | AsyncIterableIterator<T>;
}
export interface Action<T = any> {
  type: any;
  payload?: T;
}
