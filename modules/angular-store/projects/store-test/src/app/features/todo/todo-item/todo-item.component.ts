import { Store } from 'ajwah-angular-store';
import { REMOVE_TODO, UPDATE_TODO } from '../../../store/actions';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'mac-todoItem',
  templateUrl: './todo-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent {
  title: string;
  @Input() todo: any;
  constructor(public store: Store) {

  }

  updateTodo(e) {
    this.todo.completed = e.target.checked;
    this.store.dispatch({ type: UPDATE_TODO, payload: this.todo })
  }

  removeTodo() {
    this.store.dispatch({ type: REMOVE_TODO, payload: this.todo })
  }
}