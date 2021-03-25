import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview'
import { CartItem } from './cartItem';
import { useHistory } from 'react-router-dom'
import { CartController, UserController } from '../controllers'
import { dispatch, useStream } from 'ajwah-reactive-form';
import { actionType as at } from '../models';


export function ShoppingCart() {

    const history = useHistory();
    const [{ data: cartState }] = useStream(CartController, con => con.stream$, con => con.state)
    const [{ data: userState }] = useStream(UserController, con => con.stream$, con => con.state)
    const [isEnable, enableCheckout] = useState(false);

    useEffect(() => {
        if (userState.isLogedIn && isEnable) {
            checkout();
        }
    })

    function show() {
        dispatch(at.LoginDialogAction, true);
        enableCheckout(true);
    }

    function checkout() {
        history.push('/checkout')
    }


    const footer = (
        <React.Fragment>
            <div className="p-d-flex p-jc-between">
                <Button className="p-button-outlined p-button-rounded p-button-sm" onClick={() => history.push('/')}>Back to shop</Button>
                <Button className="p-button-outlined p-button-rounded p-button-sm" disabled={cartState.items.length === 0} onClick={() => { userState.isLogedIn ? checkout() : show() }}>Checkout</Button>
            </div>
        </React.Fragment>
    );

    return (
        <div className="cart">
            <div className="card">
                <DataView value={cartState.items} layout="list"
                    header={<div className="p-text-center">{cartState.items.length} Items in Your Cart</div>}
                    footer={footer}
                    itemTemplate={(item) => <CartItem item={item} />}
                />
            </div>
        </div>

    );
}



