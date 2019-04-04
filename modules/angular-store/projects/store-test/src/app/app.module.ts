import { AddTodoComponent } from './components/addTodo';
import { SearchComponent } from './components/searchComponent';
import { AddTutorial } from './components/addTutorial';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AjwahStoreModule } from 'ajwah-angular-store';
import { AppComponent } from './app.component';
import counterState from './store/counterState'
import { TutorialList } from './components/tutorialList';
import { FormsModule } from '@angular/forms';

import { devTools } from 'ajwah-devtools'
import { Counter } from './components/counter';
import { SearchEffects } from './store/SearchEffects';
import { SearchState } from './store/SearchState';
import { TodoState } from './store/todoState';
import { TodoItemComponent } from './components/todoItem';
import { TodosComponent } from './components/todos';
import { HttpClientModule } from '@angular/common/http';
import { TodoService } from './services/todoService';

@NgModule({
  declarations: [
    AppComponent, TutorialList, AddTutorial, Counter, SearchComponent,
    AddTodoComponent, TodoItemComponent, TodosComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule,
    AjwahStoreModule.bootstrap({
      states: [counterState, SearchState, TodoState],
      effects: [SearchEffects],
      devTools: devTools()
    })
  ],
  providers: [
    TodoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
