import React from 'react';
import { Button } from 'primereact/button';
import StripeCheckout from 'react-stripe-checkout';
import { useStream } from 'ajwah-reactive-form';
import { useHistory } from 'react-router-dom';
import { CartController, UserController } from '../../controllers';

export function Payment() {
    const [{ data: carttState }] = useStream(CartController, con => con.stream$, con => con.state)
    const [{ data: userState }] = useStream(UserController, con => con.stream$, con => con.state)

    const subtotal = carttState?.items.reduce((sum, { price, quantity }) => sum + (+price * quantity), 0) ?? 0;
    const history = useHistory();
    const key = process.env.REACT_APP_KEY as string;

    function tokenCallback(token: any) {
        console.log(token);
        history.push('/success');
    }
    //default card number all:42
    return (<div className="p-text-center p-pt-4">
        <StripeCheckout
            name="Stripe Payment"
            amount={subtotal * 100}
            email={userState?.customer?.email}
            token={tokenCallback}

            stripeKey={key} >
            <Button label="Payment" />
        </StripeCheckout>
    </div>)
}