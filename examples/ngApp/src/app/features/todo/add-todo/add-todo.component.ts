import { ADD_TODO } from '../../../store/actions';
import { Store } from 'ajwah-angular-store';
import { Component, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'mac-addTodo',
  templateUrl: './add-todo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTodoComponent {
  title: string;
  constructor(public store: Store) {

  }

  addTodo(e) {
    e.preventDefault();
    const newTodo = {
      title: this.title,
      completed: false
    }
    this.store.dispatch({ type: ADD_TODO, payload: newTodo });
    this.title = '';
  }
}