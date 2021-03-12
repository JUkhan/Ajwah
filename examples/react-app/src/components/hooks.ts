import {Dispatch, SetStateAction, useState, useEffect} from 'react';
import {Observable} from 'rxjs';

export function useStream<T>(stream$: Observable<T>, initialState: T):[T, Dispatch<SetStateAction<T>>] {
    const [state, setState] = useState<T>(initialState);
    useEffect(() => {
        const sub = stream$.subscribe(res => {
            setState(res);
          });
          return ()=> sub.unsubscribe();
          
    }, []);
    return [state,setState];
  }
  