
import { delay, mapTo } from 'rxjs/operators';
import { Action } from '../action'
import {actions$} from '../actions'
import { StateController} from '../stateController';
export interface CounterState{
    count: number,
    isLoading:boolean
}
export class CounterController extends StateController<CounterState> {
    constructor() {
      super('counter', {count:2, isLoading:false});
    }
    onInit(){
        this.registerEffect(
            actions$.whereType('async-inc')
                .pipe(
                    mapTo({type:'inc'})
                ),
            actions$.where(action=>action.type==='java-loom')
                .pipe(
                    mapTo({type:'inc'})
                )
        )
    }
    onAction(state:CounterState, action:Action){
        
        if(action.type==='async-inc')
            this.emit({isLoading:true})
        else if(action.type==='inc')
            this.increment()
    }

    increment() {
      this.emit({count:this.state.count+1, isLoading:false});
    }
    decrement() {
        this.emit({count:this.state.count-1, isLoading:false});
    }
     incrementNext(state:CounterState, acrion:Action){
         this.emit({count:state.count+5});  
     }
  }