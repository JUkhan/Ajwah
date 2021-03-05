import React from 'react';
import {useHistory} from 'react-router-dom';
import {Button} from 'primereact/button';

export function Success() {
  const history = useHistory();
    return (
      <div style={{ textAlign: 'center' }}>
            <h1>Success!</h1>
            <p>Your items will be shipped shortly!</p>
            <p>You will get email details.</p>

            <Button onClick={()=>history.push('/')}>Back to Shop</Button>
        </div>
    )
}