import { BehaviorSubject } from "rxjs";
import { Action } from "./action";

class Dispatcher extends BehaviorSubject<Action>{
    constructor(){
        super({type:'@INIT'});
    }
    dispatch(action:Action):void{
        this.next(action)
    }
    complete(){}
}
export const dispatcher = new Dispatcher();