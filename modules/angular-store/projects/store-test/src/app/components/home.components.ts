import { Store, select } from "ajwah-angular-store";
import { Component, ChangeDetectionStrategy } from "@angular/core";

import { SearchComponent } from "./searchComponent";
import { TutorialList } from "./tutorialList";
import { TodosComponent } from "../features/todo/todos/todos.component";
import { ContainerComponent } from "../features/todo/container/container.component";
import { TutorialContainer } from "../features/tutorial/container";

@Component({
  selector: "home-com",
  template: `<p><counter [counter]="counter$ | async"></counter></p> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  //@Select("counter")
  counter$;
  constructor() {
    this.counter$ = select("counter");
  }
  grid = ContainerComponent;
  form = ContainerComponent;
}
