import { BehaviorSubject } from "rxjs";
import { Action } from "./action";

export class Dispatcher extends BehaviorSubject<Action>{
    constructor(type: string){
        super({type});
    }
    dispatch(action:Action):void{
        this.next(action)
    }
    complete(){}
}
export const dispatcher = new Dispatcher('@INIT');