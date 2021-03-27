import { TodosController } from '../controllers/todos-controller';
import { Component, OnInit } from '@angular/core';
import { Todo } from '../model/todo';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css'],
})
export class AddTodoComponent implements OnInit {
  description = '';
  constructor(public service: TodosController) {}

  ngOnInit(): void {}
  addTodo(description: string) {
    this.service.addTodo({ description, completed: false } as Todo);
    this.description = '';
  }
}
