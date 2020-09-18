import { ADD_TUTORIAL } from '../store/actions';

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '../services/store';

@Component({
  selector: 'addTutorial',
  template: ` <form (submit)="addTutorial($event)">
    <input
      [(ngModel)]="tutorialModel.name"
      type="text"
      name="name"
      placeholder="Enter Name"
    />
    <input
      [(ngModel)]="tutorialModel.url"
      type="text"
      name="url"
      placeholder="Enter url"
    />
    <button type="submit" class="btn">Add Tutorial</button>
  </form>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTutorial {
  tutorialModel = { name: '', url: '' };
  constructor(public store: Store) {}

  addTutorial(e) {
    e.preventDefault();
    this.store.dispatch(ADD_TUTORIAL, { ...this.tutorialModel });
    this.tutorialModel.name = '';
    this.tutorialModel.url = '';
  }
}
