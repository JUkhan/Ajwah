
import { mapTo } from 'rxjs/operators';
import { Action, StateController, dispatch, actions$ } from 'ajwah-store';
import { Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounterService extends StateController<number>{

  constructor() { 
    super('counter', 0);
  }
  increment(){
    this.emit(this.state+3);
    
    
  }
  async decrement(){
    //console.log(await this.remoteController('todo'))
      this.emit(this.state-1)
  }
  async asyncInc(){
      dispatch({type:'async-inc'})
      await new Promise(resolver=>setTimeout(resolver, 1000));
      dispatch('async-inc-done')
      this.increment();
      await new Promise(resolver=>setTimeout(resolver, 1000));
      dispatch('incrementNextdd dddd')
  }
  get loading$():Observable<boolean>{
      const start = actions$.whereType('async-inc');
      const done = actions$.whereType('async-inc-done')
      return merge(
          start.pipe(mapTo(true)),
          done.pipe(mapTo(false)),
      );
  }
  onAction(state:number, action:Action){
    console.log(state, action,'---')
  }
  incrementNext(state: number, action:Action){
    this.emit(state+100)
  }
}
