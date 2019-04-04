import { ADD_TODO } from '../store/actions';
import { Store } from 'ajwah-angular-store';
import { Component, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'addTodo',
    template: `
    <form (submit)="addTodo($event)">
        <input type="text" [(ngModel)]="title" name="title" placeholder="Add Todo..." />
        <input type="submit" value="Submit" class="btn" />
    </form>`,
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