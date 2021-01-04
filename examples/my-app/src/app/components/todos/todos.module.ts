import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodosRoutingModule } from './todos-routing.module';
import { TodosComponent } from './todos.component';
import { TodosController } from './controllers/todos-controller';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AddTodoComponent } from './add-todo/add-todo.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { AutofocusDirective } from './autofocus.directive';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TodoInterceptor } from './todo-interceptor';
import { Api } from './Api';
import { RxAnimationService } from './rx-animation.service';
import { LoadingComponent } from './loading/loading.component';
import { ErrorComponent } from './error/error.component';


@NgModule({
  declarations: [TodosComponent, ToolbarComponent, AddTodoComponent, TodoItemComponent, AutofocusDirective, LoadingComponent, ErrorComponent],
  imports: [
    CommonModule,
    FormsModule,
    TodosRoutingModule,
    HttpClientModule
  ],
  providers:[
    { provide: HTTP_INTERCEPTORS, useClass: TodoInterceptor, multi: true },
    Api,
    RxAnimationService,
    TodosController]
})
export class TodosModule { }
