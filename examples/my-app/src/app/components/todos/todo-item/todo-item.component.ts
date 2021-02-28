import { TodosController } from './../controllers/todos-controller';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Todo } from '../model/todo';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnInit {

  
  @Input() todo:Todo={} as Todo;
  isDblclick = false;
  constructor(public service: TodosController) { }

  ngOnInit(): void {
  }
  updateCompleted(completed:boolean){
    this.service.updateTodo({...this.todo, completed});
  }
  updateDescription(description:string){
    this.service.updateTodo({...this.todo, description});
    this.isDblclick=false;
  }

}
