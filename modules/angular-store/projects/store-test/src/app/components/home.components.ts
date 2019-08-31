
import { Store, Select } from 'ajwah-angular-store';
import { Component, ChangeDetectionStrategy } from '@angular/core';

import { SearchComponent } from './searchComponent';
import { TutorialList } from './tutorialList';
import { TodosComponent } from '../features/todo/todos/todos.component';
import { ContainerComponent } from '../features/todo/container/container.component';
import { TutorialContainer } from '../features/tutorial/container';


@Component({
    selector: 'home-com',
    template: `<p><counter [counter]="counter$|async" ></counter></p>
    <marger-com [grid]="grid" [form]="form"></marger-com>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
    @Select('counter')
    counter$
    constructor(public store: Store) {

    }
    grid = ContainerComponent
    form = ContainerComponent
}