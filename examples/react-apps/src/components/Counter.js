import React from 'react';
import store from '../states/storeService';
import {useStreamBySelect} from 'react-ajwah';

export default () =>{
  const { counter} = useStreamBySelect({counter: store.select('counter')})

    return (
      <div>
        {counter && <div>
          <button onClick={() => store.dispatch("Inc")}>+</button>
          <button onClick={() => store.dispatch("Dec")}>-</button>
          <button onClick={() => store.dispatch("AsyncInc")}>async(+)</button>
          <span>{counter.msg || counter.count}</span>
        </div>}
      </div>
    );
}
