import { LOAD_TODOS } from './store/actions';
import { Subscription, Observable } from 'rxjs';
//import { TutorialState } from './store/tutorialState';
import { TutorialState } from './store.convention/tutorialState';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, Select } from 'ajwah-angular-store';
import { DynamicEffect } from './store/effects';
import { DYNAMIC_EFFECTS_KEY } from './store/actions';
import { AppState, ICounterState, ITodoState } from './store/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})
export class AppComponent implements OnDestroy, OnInit {
  subscription: Subscription
  constructor(private store: Store<AppState>) {
    this.subscription = this.store.select('counter').subscribe(res => this.counter = res);
    this.subscription.add(this.store.select('tutorial').subscribe(res => this.tutorial = res));
    this.subscription.add(this.store.select('todo').subscribe(res => this.todo = res));
    this.store.dispatch({ type: LOAD_TODOS });

    this.jac.subscribe(res => console.log(res))
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
    this.store.addState(TutorialState);
  }
  removeState() {
    this.store.removeState('tutorial')
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.store.exportState().subscribe(([action, state]) => {
      state.todo = undefined;
      console.log(action, state);
    })

  }

  @Select<AppState>(state => state.counter)
  mac: Observable<ICounterState>;

  @Select('todo')
  jac: Observable<ITodoState>;

}
