import { SEARCH_KEYSTROKE } from '../store/actions';

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from 'ajwah-angular-store';
import { Observable } from 'rxjs';

@Component({
  selector: 'search',
  template: `<div *ngIf="search$ | async as search">
  <input (input)="inputHandler($event)" type="text" placeholder="wiki search...">
    <b>{{search.loading ? 'loading...':''}}</b>
    <div *ngFor="let data of search.res">{{data}}</div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {

  search$: Observable<any>;

  constructor(public store: Store) {
    this.search$ = this.store.select('search');
  }

  inputHandler(event) {
    this.store.dispatch({ type: SEARCH_KEYSTROKE, payload: event.target.value });
  }

}
