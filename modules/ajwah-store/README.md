## Ajwah Store

A reactive state management library. Manage your application's states, effects, and actions easy way. Make apps more scalable with a unidirectional data-flow.

counter : [Angular Demo](https://stackblitz.com/edit/angular-ajwah-counter?file=src%2Fapp%2Fapp.component.ts) | [React Demo](https://stackblitz.com/edit/react-ajwah-counter?file=index.tsx) | [Vue Demo](https://stackblitz.com/edit/vue-ajwah-counter?file=src%2FApp.vue)

todos : [Angular Demo](https://stackblitz.com/edit/angular-ajwah-test?file=src%2Fapp%2Fapp.component.ts) | [React Demo](https://stackblitz.com/edit/react-ts-cb9zfa?file=index.tsx) | [Vue Demo](https://stackblitz.com/edit/vue-ajwah-store?file=src%2FApp.vue)

### Installation for (angular/react/vue/others)

```sh
>> npm i ajwah-store
>> npm i ajwah-devtools [optional]
```

Define a state controller class

```ts
import { mapTo } from "rxjs/operators";
import { StateController } from "ajwah-store";
import { Injectable } from "@angular/core";
import { merge, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CounterService extends StateController<number> {
  constructor() {
    super("cointer", 0);
  }

  increment() {
    this.update((state) => state + 1);
  }

  decrement() {
    this.update((state) => state - 1);
  }

  async asyncInc() {
    this.dispatch("async-inc");
    await new Promise((resolver) => {
      setTimeout(() => {
        resolver(2);
      }, 1000);
    });
    this.dispatch("async-inc-done");
    this.increment();
  }

  get loading$(): Observable<boolean> {
    const start = this.actions.whereType("async-inc");
    const done = this.actions.whereType("async-inc-done");
    return merge<boolean>(start.pipe(mapTo(true)), done.pipe(mapTo(false)));
  }
}
```

Consuming state:

`counterComponent`

```ts
import { CounterService } from "../../services/counter.service";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  selector: "app-counter",
  template: `
    <p>
      <button class="btn" (click)="service.increment()">+</button>
      <button class="btn" (click)="service.decrement()">-</button>
      <button class="btn" (click)="service.asyncInc()">async(+)</button>
      {{ service.stream$ | async }} <app-loading></app-loading>
    </p>
  `,
  styleUrls: ["./counter.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterComponent implements OnInit {
  constructor(public service: CounterService) {}

  ngOnInit(): void {}
}
```

`loadingComponent`

```ts
import { CounterService } from "../../services/counter.service";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";

@Component({
  selector: "app-loading",
  template: ` <span *ngIf="service.loading$ | async"> loading... </span> `,
  styleUrls: ["./loading.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent implements OnInit {
  constructor(public service: CounterService) {}

  ngOnInit(): void {}
}
```
