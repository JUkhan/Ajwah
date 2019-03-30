
import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable()
export class Dispatcher extends BehaviorSubject<any> {
    constructor() {
        super({ type: '@@INIT' });
    }

    dispatch(action) {
        if (typeof action === 'undefined') {
            throw new TypeError(`Actions must be objects`);
        }
        else if (typeof action.type === 'undefined') {
            throw new TypeError(`Actions must have a type property`);
        }
        this.next(action);
    }

    complete() {
    }

    dispose() {
        super.complete();
    }
}
