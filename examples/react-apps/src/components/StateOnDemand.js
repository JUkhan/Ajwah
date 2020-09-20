import React from 'react';
import store from '../states/storeService';
import registerCounterState from '../states/counterState';
import {debounceTime, map} from 'rxjs/operators';

const effectKey='asyncIn-effect-key';
export default () =>{
  
    return (
      <div>
        <p>
          <button onClick={() => registerCounterState()}> Add State</button>
          <button onClick={() => store.unregisterState("counter")}>Remove State</button>
          <button onClick={() => store.importState({counter:{count:999, msg:''}  })}>Import State</button>
        </p>
        <p>
          <button onClick={addEffect}> Add AsyncInc Effect</button>
          <button onClick={()=>store.unregisterEffect(effectKey)}> Remove AsyncInc Effect</button>
        </p>
        </div>
    );
}
function addEffect(){
  store.registerEffect(
      (action$, _) =>
        action$.whereType('AsyncInc').pipe(
          debounceTime(1000),
          map((a) => ({ type: 'Inc' }))
        ),
      effectKey
    );
}
