import React from 'react';
import store from '../states/storeService';
import {useStreamBySelect} from 'react-ajwah';

export default () =>{
  const { actionAndState } = useStreamBySelect({actionAndState:store.exportState()});
    return (
      <div>
        <pre>{JSON.stringify(actionAndState,null, 4)}</pre>
      </div>
    );
}
