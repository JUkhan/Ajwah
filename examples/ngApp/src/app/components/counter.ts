import { mapTo } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { debounceTime } from 'rxjs/operators';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from '../store/actions';

import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { registerCounterState } from '../store/counterState';
import { Store } from '../services/store';

@Component({
  selector: 'counter',
  template: `
    <button (click)="removeState()">Remove State</button>
    <button (click)="addState()">Add State</button>
    <button (click)="addEffect()">Add Effect</button>
    <button (click)="removeEffect()">Remove Effect</button>
    <button (click)="importState()">Import</button>
    <p *ngIf="counter">
      <button class="btn" (click)="inc()">+</button>
      <button class="btn" (click)="dec()">-</button>
      <button class="btn" (click)="asyncInc()">async(+)</button>
      {{ counter.msg || counter.count }}
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Counter {
  @Input() counter: any;

  constructor(public store: Store) { }

  inc() {
    this.store.dispatch(INCREMENT);
  }
  dec() {
    this.store.dispatch(DECREMENT);
  }
  asyncInc() {
    this.store.dispatch(ASYNC_INCREMENT);
  }

  removeState() {
    this.store.unregisterState('counter');
  }
  addState() {
    registerCounterState(this.store);
  }
  effectKey = 'asyncInc-effect';
  addEffect() {
    this.store.registerEffect(
      this.effectKey,
      (action$, _) =>
        action$.whereType('AsyncInc').pipe(
          debounceTime(1000),
          map((a) => ({ type: 'Inc' }))
        )
    );
  }
  removeEffect() {
    this.store.unregisterEffect(this.effectKey);
  }
  importState() {
    this.store.importState({ counter: { count: 100, msg: '' } });
  }
}
