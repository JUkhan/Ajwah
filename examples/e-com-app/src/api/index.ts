import {ajax} from 'rxjs/ajax';
import { Observable } from 'rxjs';
import {pluck} from 'rxjs/operators';

    const baseUrl = 'https://backendapi.turing.com/';
    
    export function get<S>(path:string):Observable<S> {
        return ajax.get(baseUrl+path).pipe(pluck('response'))
    }
    export function post<S>(path:string, model:any):Observable<S>{
        return ajax.post(baseUrl+path, model, { "user-key": localStorage.getItem('token') }).pipe(pluck('response'))
    }
    export function put<S>(path:string, model:any):Observable<S>{
        return ajax.put(baseUrl+path, model, { "user-key": localStorage.getItem('token') }).pipe(pluck('response'))
    }
    export function remove<S>(path:string):Observable<S>{
        return ajax.delete(baseUrl + path).pipe(pluck('response'))
    }
    

