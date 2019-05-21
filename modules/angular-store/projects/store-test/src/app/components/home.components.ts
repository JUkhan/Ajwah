
import { Store, Select } from 'ajwah-angular-store';
import { Component, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'home-com',
    template: `<p><counter [counter]="counter$|async" ></counter></p>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
    @Select('counter')
    counter$
    constructor(public store: Store) {

    }


}