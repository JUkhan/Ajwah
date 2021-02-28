
import {StateController} from './stateController';


const _container:{[key:string]: any}={};

export function Get<T extends StateController<any>>(controllerType:  new () => T): T{
     if(!_container[controllerType.name]){
        _container[controllerType.name]=new controllerType();
      }
    return _container[controllerType.name];
}

export function RemoveInst<T extends StateController<any>>(controllerType:  new () => T): boolean{
    if(_container[controllerType.name]){
       delete _container[controllerType.name];
       return true;
    }
   return false;
}