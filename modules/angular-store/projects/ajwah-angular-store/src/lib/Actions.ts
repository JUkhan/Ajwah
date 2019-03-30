
import { Observable, Operator } from "rxjs";
import { ofType } from "./operators";
import { Injectable, Inject } from '@angular/core';
import { Dispatcher } from './Dispatcher';


@Injectable()
export class Actions<V = any> extends Observable<V> {

    constructor(@Inject(Dispatcher) source?: Observable<V>) {
        super();
        if (source)
            this.source = source;
    }

    lift<R>(operator: Operator<V, R>): Observable<R> {
        const observable = new Actions();
        observable.source = this;
        observable.operator = operator;
        return observable;
    }

    ofType(...actionTypes: any[]) {
        return ofType(...actionTypes)(this);
    }
}
