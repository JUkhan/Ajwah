import { Store } from 'ajwah-angular-store';
import { REMOVE_TODO, UPDATE_TODO } from '../store/actions';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
    selector: 'todoItem',
    template: `
    <div class="todo-item" [ngClass]="{'is-complete':todo.completed}" >
    <p>
      <input [checked]="todo.completed" type="checkbox" (change)="updateTodo($event)" />
      <span class="item-text">{{todo.title}}</span>
      <button (click)="removeTodo()" class="del">x</button>
    </p>
  </div>`,
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