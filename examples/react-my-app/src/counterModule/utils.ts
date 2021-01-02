
import { StateController, AjwahStore } from 'ajwah-store';
import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

const _container:{[key:string]: any}={};

export function Get<T extends StateController<any>| AjwahStore>(controllerType:  new () => T): T{
     if(!_container[controllerType.name]){
         _container[controllerType.name]=new controllerType();
     }
    return _container[controllerType.name];
}

export function Remeve<S,T extends StateController<S>| AjwahStore>(controllerType:  new () => T): boolean{
    if(_container[controllerType.name]){
        _container[controllerType.name].dispose();
       delete _container[controllerType.name];
    }
   return false;
}

export function useStream<T>(stream$: Observable<T>, initialState: T) {
    const [state, setState] = useState<T>(initialState);
    useEffect(() => cleanupSubscriptions(setState, stream$), []);
    return state;
  }
  
  function cleanupSubscriptions<T>(setState: (state: T) => void, stream$: Observable<T>) {
    const sub = stream$.subscribe(res => {
      setState(res);
    })
    return function () {
      sub.unsubscribe();
    };
  }
  