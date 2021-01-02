import { mapTo } from 'rxjs/operators';
import { StateController } from 'ajwah-store';
import { Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounterService extends StateController<number>{

  constructor() { 
    super('cointer', 0)
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
      return merge<boolean>(
          start.pipe(mapTo(true)),
          done.pipe(mapTo(false)),
      );
  }
}
