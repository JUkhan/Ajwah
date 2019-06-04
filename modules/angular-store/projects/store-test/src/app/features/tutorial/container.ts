import { ADD_TUTORIAL } from '../../store/actions';
import { Store, Select } from 'ajwah-angular-store';
import { Component, ChangeDetectionStrategy } from '@angular/core';



@Component({
  selector: 'tutorial-container',
  template: `
    <div *ngIf="tutorial$|async as tutorial">
  <addTutorial></addTutorial>
  <tutorialList [tutorials]="tutorial.data" [counter]="counter$|async"></tutorialList>
</div>
   `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TutorialContainer {

  @Select('tutorial') tutorial$

  @Select('counter') counter$

  constructor(public store: Store) {
    console.log('TutorialContainer....')
  }


}