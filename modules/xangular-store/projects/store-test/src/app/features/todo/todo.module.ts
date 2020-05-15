import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContainerComponent } from './container/container.component';
import { RouterModule, Routes } from '@angular/router';
import { AddTodoComponent } from './add-todo/add-todo.component';

import { TodosComponent } from './todos/todos.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { JTodoService } from './services/jtodoService';
import { JTodoState } from './store/jtodoState'
import { AjwahStoreModule } from 'ajwah-angular-store';
import { TutorialModule } from '../tutorial/tutorial.module'

const routes: Routes = [
  {
    path: '', component: ContainerComponent
  }
]
@NgModule({
  declarations: [ContainerComponent, AddTodoComponent, TodosComponent, TodoItemComponent],
  imports: [
    CommonModule, FormsModule,

    RouterModule.forChild(routes),
    AjwahStoreModule.forFeature({
      featureStates: [JTodoState]
    }),
    TutorialModule,
  ],
  providers: [
    JTodoService
  ]
})
export class TodoModule { }
