import { REMOVE_TUTORIAL } from './actions';
import { Store } from 'ajwah-angular-store';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'tutorialList',
    template: `
    <div class="list-group" *ngIf="tutorial$|async as tutorial">
    <a href="#" class="list-group-item list-group-item-action active">
        Tutorials
    </a>
    <a *ngFor="let t of tutorial.data" href="#" class="list-group-item list-group-item-action" (click)="onRemove(t.name)" key={t.name} >{{t.name}}</a>

</div>
`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TutorialList {
    tutorial$: Observable<any>;

    constructor(public store: Store) {
        this.tutorial$ = this.store.select('tutorial');
    }

    onRemove(name) {
        this.store.dispatch({ type: REMOVE_TUTORIAL, payload: name });
    }
}