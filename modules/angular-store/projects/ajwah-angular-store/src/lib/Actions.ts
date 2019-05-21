import { Observable, Operator } from "rxjs";
import { Injectable, Inject } from '@angular/core';
import { Dispatcher } from './dispatcher';
import { IAction } from './model';

@Injectable()
export class Actions<V = IAction> extends Observable<V> {

    constructor(@Inject(Dispatcher) source?: Observable<V>) {
        super();
        if (source)
            this.source = source;
    }

    lift<R>(operator: Operator<V, R>): Observable<R> {
        const observable = new Actions<V>(this);
        observable.operator = operator as any;
        return observable as any;
    }

}
