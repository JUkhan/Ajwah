import { Observable, Operator } from "rxjs";
import { Injectable, Inject } from '@angular/core';
import { Dispatcher } from './dispatcher';
import { Action } from './model';

@Injectable()
export class Actions<V = Action> extends Observable<V> {

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

    /*ofType(...actionTypes: string[]) {
        return this.pipe(
            filter((action: Action) => actionTypes.some(type => type === action.type))
        )
        return ofType(...actionTypes)(this);
    }*/
}
