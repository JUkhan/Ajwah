import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from '../store/actions';
import { Store } from 'ajwah-angular-store';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';


@Component({
    selector: 'counter',
    template: `
    <p *ngIf="counter">
        <button class="btn" (click)="inc()">+</button>
        <button class="btn" (click)="dec()">-</button>
        <button class="btn" (click)="asyncInc()">async(+)</button>
        {{counter.msg||counter.count}}
    </p>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Counter {

    @Input() counter: any;

    constructor(public store: Store) {
    }

    inc() {
        this.store.dispatch({ type: INCREMENT });
    }
    dec() {
        this.store.dispatch({ type: DECREMENT });
    }
    asyncInc() {
        this.store.dispatch({ type: ASYNC_INCREMENT });
    }

}