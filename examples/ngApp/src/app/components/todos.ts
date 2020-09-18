import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store } from '../services/store';

@Component({
  selector: 'todos',
  template: `
    <div>
      <todoItem *ngFor="let todo of todos" [todo]="todo"></todoItem>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent {
  @Input() todos: any[];
  constructor(public store: Store) {}
}
