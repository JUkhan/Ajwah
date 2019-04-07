import { LOAD_TODOS } from './store/actions';
import { Subscription } from 'rxjs';
//import { TutorialState } from './store/tutorialState';
import { TutorialState } from './store.convention/tutorialState';

import { Component, OnDestroy } from '@angular/core';
import { Store } from 'ajwah-angular-store';
import { DynamicEffect } from './store/effects';
import { DYNAMIC_EFFECTS_KEY } from './store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnDestroy {
  subscription: Subscription
  constructor(private store: Store) {
    this.subscription = this.store.select('counter').subscribe(res => this.counter = res);
    this.subscription.add(this.store.select('tutorial').subscribe(res => this.tutorial = res));
    this.subscription.add(this.store.select('todo').subscribe(res => this.todo = res));
    this.store.dispatch({ type: LOAD_TODOS });
  }

  counter: any;
  tutorial: any;
  todo: any;
  addEffect() {
    this.store.addEffects(DynamicEffect);
  }
  removeEffect() {
    this.store.removeEffectsByKey(DYNAMIC_EFFECTS_KEY);
  }
  addState() {
    this.store.addStates(TutorialState);
  }
  removeState() {
    this.store.removeStates('tutorial')
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
