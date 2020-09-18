import { Component, ChangeDetectionStrategy } from '@angular/core';

import { Store } from '../services/store';

@Component({
  selector: 'home-com',
  template: `<p><counter [counter]="counter$ | async"></counter></p> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  //@Select("counter")
  counter$;
  constructor(private store: Store) {
    this.counter$ = store.select('counter');
  }
}
