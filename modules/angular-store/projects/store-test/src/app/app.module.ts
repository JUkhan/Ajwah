import { HomeComponent } from './components/home.components';
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
//import { SearchEffects } from './store/SearchEffects';
import { SearchEffects } from './store.convention/SearchEffects';
//import { SearchState } from './store/SearchState';
import { SearchState } from './store.convention/SearchState';
//import { TodoState } from './store/todoState';
import { TodoState } from './store.convention/todoState';
import { TodoItemComponent } from './components/todoItem';
import { TodosComponent } from './components/todos';
import { HttpClientModule } from '@angular/common/http';
import { TodoService } from './services/todoService';
import { AppRoutingModule } from './app.routing.module';


@NgModule({
  declarations: [
    AppComponent, TutorialList, AddTutorial, Counter, SearchComponent,
    AddTodoComponent, TodoItemComponent, TodosComponent, HomeComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpClientModule, AppRoutingModule,
    AjwahStoreModule.forRoot({
      rootStates: [counterState, /*SearchState, TodoState*/],
      //effects: [SearchEffects],
      devTools: devTools(),
      //actionsMethodStartsWith: 'on',
      //effectsMethodStartsWith: 'myEffect',
      enableCodingByConvention: true
    })
  ],
  providers: [
    TodoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
