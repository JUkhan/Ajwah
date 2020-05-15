import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AjwahStoreModule } from "ajwah-angular-store";
import { AddTutorial } from "./addTutorial";
import { TutorialList } from "./tutorialList";
import { RouterModule, Routes } from "@angular/router";
import { TutorialState } from "./tutorialState";
import { TutorialContainer } from "./container";
import { Counter } from "./counter";
import { TutorialEffects } from "./tutorialEffects";

//import { TodoEffect } from '../store/todo/todoEffects';

const routes: Routes = [
  {
    path: "",
    component: TutorialContainer,
  },
];
@NgModule({
  declarations: [AddTutorial, TutorialList, TutorialContainer, Counter],
  imports: [
    CommonModule,
    FormsModule,
    // RouterModule.forChild(routes),
    /* AjwahStoreModule.forFeature({
      featureStates: [TutorialState],
      //featureEffects: [TutorialEffects]
    }),*/
  ],
  exports: [TutorialContainer],
  providers: [],
})
export class TutorialModule {}
