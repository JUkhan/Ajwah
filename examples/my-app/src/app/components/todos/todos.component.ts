import { Todo } from './model/todo';
import { Subscription } from 'rxjs';
import { TodosController } from './controllers/todos-controller';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
 
  constructor(public controller: TodosController) {}
  
  ngOnInit(): void {
   !this.controller.currentState.todos.length &&  this.controller.loadTodos();
  }
  thrackById(id:number, t:Todo){
    return t.id
  }
}
