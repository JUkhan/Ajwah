import { mapTo } from 'rxjs/operators';
import { Get, Action, StateController, dispatch, actions$} from 'ajwah-store';
import { merge, Observable } from 'rxjs';




export class CounterController extends StateController<number>{

  constructor() { 
    super('counter', 90)
  }
  increment(){
    this.emit(this.state+1);
  }
  decrement(){
      this.emit(this.state-1);
      
  }
  
  async asyncInc(){
      dispatch('async-inc')
      await new Promise(resolver=>{
          setTimeout(resolver, 1000);
      })
      dispatch('async-inc-done')
      this.increment()
  }
  get loading$():Observable<boolean>{
      const start = actions$.whereType('async-inc');
      const done = actions$.whereType('async-inc-done')
      return merge<boolean>(
          start.pipe(mapTo(true)),
          done.pipe(mapTo(false)),
      );
  }
  onInit(){
    console.log('onInit...')
  }
  onAction(state:number, action:Action){
    console.log(state, action);
  }
}
