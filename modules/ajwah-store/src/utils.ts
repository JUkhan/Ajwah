export function copyObj(obj: any) {
  return Array.isArray(obj) ? [...obj] : { ...obj };
}
export function flatMap(arr: any[]): any[] {
  return [].concat.apply([], arr);
}
export interface Action<T = any> {
  type: any;
  payload?: T;
}
export const IMPORT_STATE = "ajwah/ImportState";
export declare function Reducer<T = any>(state: T, action: Action): any;
