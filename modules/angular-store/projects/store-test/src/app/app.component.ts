import { TutorialState } from './tutorialState';

import { Component, Injector, Type } from '@angular/core';
import { Store } from 'ajwah-angular-store';
import { Observable } from 'rxjs';
import { INCREMENT, DECREMENT, ASYNC_INCREMENT } from './actions';
import { MyEffect } from './effects';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent {
  constructor(private store: Store) {
    // this.getEffect(MyEffect);

  }
  getEffect(type: Type<any>) {
    // const eff = this.inject.get(type);
    //console.log(eff);
  }
  counter$: Observable<any>;

  ngOnInit() {
    this.counter$ = this.store.select(state => state.counter);
  }

  inc() {
    this.store.dispatch({ type: INCREMENT });
  }
  dec() {
    this.store.dispatch({ type: DECREMENT });
  }
  async_inc() {
    this.store.dispatch({ type: ASYNC_INCREMENT });
  }

  addEffect() {
    this.store.addEffects(MyEffect);
  }
  removeEffect() {
    this.store.removeEffectsByKey('test');
  }
  addState() {
    this.store.addStates(TutorialState);
  }
  removeState() {
    this.store.removeStates('tutorial')
  }
}
