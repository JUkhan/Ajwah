import { ADD_TODO } from '../store/actions';

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '../services/store';

@Component({
  selector: 'addTodo',
  template: ` <form (submit)="addTodo($event)">
    <input
      type="text"
      [(ngModel)]="title"
      name="title"
      placeholder="Add Todo..."
    />
    <input type="submit" value="Submit" class="btn" />
  </form>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTodoComponent {
  title: string;
  constructor(public store: Store) {}

  addTodo(e) {
    e.preventDefault();
    const newTodo = {
      title: this.title,
      completed: false,
    };
    this.store.dispatch(ADD_TODO, newTodo);
    this.title = '';
  }
}
