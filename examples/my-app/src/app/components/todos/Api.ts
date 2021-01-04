import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, share } from "rxjs/operators";

import { EMPTY, Observable } from "rxjs";

@Injectable()
export class Api {
  constructor(public http: HttpClient) {}

  fetch<T>(path: string): Observable<any> {
    return this.http.get(path).pipe(share());
  }
  add(path: string, model: any): Observable<any> {
    return this.http.post(path, model);
  }
  update(path: string, model: any): Observable<any> {
    return this.http.put(path, model);
  }
  remove(path: string): Observable<any> {
    return this.http.delete(path);
  }
}