
import { PureComponent } from 'react';
import { StateController } from './stateController';
import {Get, RemoveInstance} from './provider';
export type ControllerType<T, S> = T & StateController<S>

export interface RxStateProps<T>{
    stateController:  new ()=>T,
    render(controller: T):any,
    cleanState?:boolean
}

export class RxState<S extends StateController<any>> extends PureComponent<RxStateProps<S>, any>{

    controller:ControllerType<any, S>

    constructor(props: RxStateProps<S>) {
        super(props);
        this.controller=Get(props.stateController);
        
    }

    componentWillUnmount() {
       if(this.props.cleanState){
           this.controller.dispose();
           RemoveInstance(this.props.stateController);
       }
    }

    render() { 
        return  this.props.render(this.controller);
    }
}