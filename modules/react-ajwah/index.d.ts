import { Observable } from "rxjs";

export declare function Connect(splitedState?: { [key: string]: (state: any) => any }, componentInstance?: any): any;
export declare function useSubscriptions<S>(states: string[]): S;
export declare function useSubscriptions(states: string[]): { [key: string]: any };

export declare function useSubscriptions2<S>(states: { [key: string]: Observable<T> }): S;
export declare function useSubscriptions2(states: { [key: string]: Observable<T> }): { [key: string]: any };
