
import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';


// const _container:{[key:string]: any}={};

// export function Get<T extends StateController<any>| AjwahStore|PartialStateController<any>>(controllerType:  new () => T): T{
//      if(!_container[controllerType.name]){
//         _container[controllerType.name]=new controllerType();
//       }
//     return _container[controllerType.name];
// }

// export function RemeveInst<T extends StateController<any>| AjwahStore|PartialStateController<any>>(controllerType:  new () => T): boolean{
//     if(_container[controllerType.name]){
//        delete _container[controllerType.name];
//        return true;
//     }
//    return false;
// }

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
  