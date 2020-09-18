import { HomeComponent } from './components/home.components';
import { AddTodoComponent } from './components/addTodo';
import { SearchComponent } from './components/searchComponent';
import { AddTutorial } from './components/addTutorial';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { TutorialList } from './components/tutorialList';
import { FormsModule } from '@angular/forms';

import { Counter } from './components/counter';

import { TodoItemComponent } from './components/todoItem';

import { HttpClientModule } from '@angular/common/http';
import { TodoService } from './services/todoService';
import { AppRoutingModule } from './app.routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from './services/store';

@NgModule({
  declarations: [
    AppComponent,
    TutorialList,
    AddTutorial,
    Counter,
    SearchComponent,
    AddTodoComponent,
    TodoItemComponent,
    HomeComponent,
  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,

    BrowserAnimationsModule,
  ],
  providers: [TodoService, Store],
  bootstrap: [AppComponent],
})
export class AppModule {}
