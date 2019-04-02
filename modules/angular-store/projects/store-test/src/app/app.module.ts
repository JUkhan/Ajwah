import { AddTutorial } from './addTutorial';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AjwahStoreModule } from 'ajwah-angular-store';
import { AppComponent } from './app.component';
import counterState from './counterState'
import { TutorialList } from './tutorialList';
import { FormsModule } from '@angular/forms';

import { devTools } from 'ajwah-devtools'


@NgModule({
  declarations: [
    AppComponent, TutorialList, AddTutorial
  ],
  imports: [
    BrowserModule, FormsModule,
    AjwahStoreModule.bootstrap({
      states: [counterState],
      devTools: devTools()
    })
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
