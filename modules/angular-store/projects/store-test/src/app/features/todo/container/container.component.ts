import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from 'ajwah-angular-store';
import { Observable } from 'rxjs';
import { ITodoState, AppState } from '../../../store/model';

import { JTodoState } from '../store/jtodoState';
/*
import { LoadTodos } from 'src/app/store/actionTypes';
import { TodoState } from 'src/app/store/todo/todoState';
import { TodoEffect } from 'src/app/store/todo/todoEffects';
import { TodoService } from 'src/app/services/todo.service';*/

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit, OnDestroy {

  ngOnInit() {
    //this.store.addFeatureState(JTodoState);
  }

  @Select('jtodo')
  todo$: Observable<ITodoState>;

  constructor(private store: Store, state: JTodoState) {
    //console.log(state)
    this.store.addFeatureStates([state]);
    this.store.dispatch('LoadTodos');
    //this.todo$ = this.store.select('jtodo');
  }

  ngOnDestroy() {

    this.store.removeState('jtodo');
    console.log('remove state-todos...')
  }
  showForm() {

    this.store.dispatch('ShowForm');
  }
  hideForm() {
    this.store.dispatch('HideForm');
  }
}
