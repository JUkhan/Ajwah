import { ADD_TUTORIAL } from './actions';
import { Store } from 'ajwah-angular-store';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'addTutorial',
    template: `
    <form (submit)="addTutorial($event)" *ngIf="tutorial$|async as tutorial">
            <div class="form-group">
                <label htmlFor="name">Tutorial Name</label>
                <input [(ngModel)]="tutorialModel.name" type="text" class="form-control" id="name" name="name"  placeholder="Enter Name" />
            </div>
            <div class="form-group">
                <label htmlFor="url">URL</label>
                <input [(ngModel)]="tutorialModel.url" type="text" class="form-control" id="url" name="url"  placeholder="Enter url" />
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTutorial {
    tutorial$: Observable<any>;
    tutorialModel = { name: '', url: '' };
    constructor(public store: Store) {
        this.tutorial$ = this.store.select(state => state.tutorial);
    }

    addTutorial(e) {
        e.preventDefault();
        console.log(this.tutorialModel);
        this.store.dispatch({ type: ADD_TUTORIAL, payload: this.tutorialModel });
    }
}