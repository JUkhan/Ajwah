import { RootState } from './root-state';
import { mapTo } from 'rxjs/operators';
import { Action, StateController } from 'ajwah-store';
import { Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounterService extends StateController<number>{

  constructor(private rstore:RootState) { 
    super('counter',0, rstore);
  }
  increment(){
    this.update(state=>state+1);
  }
  decrement(){
      this.update(state=>state-1)
  }
  async asyncInc(){
      this.dispatch('async-inc')
      await new Promise(resolver=>{
          setTimeout(() => {
              resolver(2)
          }, 1000);
      })
      this.dispatch('async-inc-done')
      this.increment()
  }
  get loading$():Observable<boolean>{
      const start = this.actions.whereType('async-inc');
      const done = this.actions.whereType('async-inc-done')
      return merge(
          start.pipe(mapTo(true)),
          done.pipe(mapTo(false)),
      );
  }
  onAction(state:number, action:Action){
    console.log(state, action)
  }
}
