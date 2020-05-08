import { HomeComponent } from "./components/home.components";
import { AddTodoComponent } from "./components/addTodo";
import { SearchComponent } from "./components/searchComponent";
import { AddTutorial } from "./components/addTutorial";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AjwahStoreModule } from "ajwah-angular-store";
import { AppComponent } from "./app.component";
import counterState from "./store/counterState";
import { TutorialList } from "./components/tutorialList";
import { FormsModule } from "@angular/forms";

import { devTools } from "ajwah-devtools";
import { Counter } from "./components/counter";
//import { SearchEffects } from './store/SearchEffects';

import { TodoItemComponent } from "./components/todoItem";

import { HttpClientModule } from "@angular/common/http";
import { TodoService } from "./services/todoService";
import { AppRoutingModule } from "./app.routing.module";
import { MergerComponent } from "./merger/marger.component";
import { FormDirective, GridDirective } from "./merger/anchors";
import { MargerState } from "./merger/margerState";
//import { TodoModule } from './features/todo/todo.module';
//import { TutorialModule } from './features/tutorial/tutorial.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

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
    MergerComponent,
    FormDirective,
    GridDirective,
  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AjwahStoreModule.forRoot({
      rootStates: [counterState, MargerState /*,SearchState, TodoState*/],
      //effects: [SearchEffects],
      devTools: devTools(),
      //actionsMethodStartsWith: 'on',
      //effectsMethodStartsWith: 'myEffect',
      //enableCodingByConvention: true
    }),
    //TodoModule,
    //TutorialModule,
    BrowserAnimationsModule,
  ],
  providers: [TodoService],
  bootstrap: [AppComponent],
})
export class AppModule {}
