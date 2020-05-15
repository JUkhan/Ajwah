import { REMOVE_TUTORIAL } from '../../store/actions';
import { Store } from 'ajwah-angular-store';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';


@Component({
    selector: 'tutorialList',
    template: `
    <ul class="list-group" >
        <li class="list-group-item active">Tutorials</li>
        <li *ngFor="let t of tutorials"  class="list-group-item">{{t.name}} <span class="del" (click)="onRemove(t.name)">x</span></li>
    </ul>
    <counter [counter]="counter"></counter>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TutorialList {
    @Input() tutorials: any[];
    @Input() counter: any[];
    constructor(public store: Store) {

    }

    onRemove(name) {
        this.store.dispatch({ type: REMOVE_TUTORIAL, payload: name });
    }
}