import { LOAD_TODOS } from './store/actions';
import { Subscription, Observable } from 'rxjs';
//import { TutorialState } from './store/tutorialState';

import { Component, OnDestroy, OnInit } from '@angular/core';

//import { DynamicEffect } from "./store/effects";
import { DYNAMIC_EFFECTS_KEY } from './store/actions';
import { AppState, ICounterState, ITodoState } from './store/model';
import { Store } from './services/store';
import { devTools } from 'ajwah-devtools';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy, OnInit {
  subscription: Subscription;
  constructor(private store: Store<AppState>) {
    devTools({ store });
    store.exportState().subscribe(console.log);
  }

  counter: any;
  tutorial: any;
  todo: any;
  addEffect() {
    // this.store..addEffects(DynamicEffect);
  }
  removeEffect() {
    // this.store.removeEffectsByKey(DYNAMIC_EFFECTS_KEY);
  }
  addState() {
    //this.store.addState(TutorialState);
  }
  removeState() {
    this.store.unregisterState('tutorial');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngOnInit() {
    // this.store.exportState().subscribe(([action, state]) => {
    //   console.group(action.type);
    //   console.info('payload: ', action.payload);
    //   console.info(state);
    //   console.groupEnd();
    // })
  }

  //@Select<AppState>((state) => state.counter)
  mac: Observable<ICounterState>;

  //@Select("todo")
  jac: Observable<ITodoState>;
}
