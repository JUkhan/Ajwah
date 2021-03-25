import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useStream } from 'ajwah-reactive-form';

import { CartController, UserController } from '../../controllers';
import { CartItem } from '../../models';

export function Confirmation() {
    const [{ data: items }] = useStream(
        CartController,
        con => con.select<CartItem[]>(state => state.items),
        con => con.state.items
    )
    const [{ data: user }] = useStream(UserController, con => con.stream$, con => con.state)

    const subtotal = items?.reduce((sum, { price, quantity }) => sum + (+price * quantity), 0) ?? 0;
    const shipping = user?.billingDetails?.deliveryOption === '1' ? 0 : 15;
    const delivery = user?.billingDetails?.isBiAsDelivery ? user.billingDetails.billingAddress : user?.billingDetails?.deliveryAddress;

    const footer = <div className="p-grid">
        <div className="p-col-4">
            <h4>Subtotal</h4>
            <div>{subtotal.toFixed(2)}</div>
        </div>
        <div className="p-col-4">
            <h4>Shipping</h4>
            <div>{shipping || 'free'}</div>
        </div>
        <div className="p-col-4">
            <h4>Grand Total</h4>
            <div>{(subtotal + shipping).toFixed(2)}</div>
        </div>
    </div>
    return (<div className="p-grid">
        <div className="p-col-8">
            <DataTable value={items} header="Order Summery" footer={footer} className="p-datatable-gridlines">
                <Column field="name" header="Item"></Column>
                <Column field="quantity" header="Qty"></Column>
                <Column field="price" header="Price"></Column>

            </DataTable>

        </div>
        <div className="p-col-4 p-pl-2">
            <h4>Address</h4>
            <span>{delivery?.address} - {delivery?.state} - {delivery?.city}</span>
            <h4>Delivery Options</h4>
            <span className="p-text-italic">{user?.billingDetails?.deliveryOption === '1' ? <span><b>Standard shipping: </b>(free, 2-3 business days)</span> : <span><b>Express shipping: </b>($15, 1-2 business days)</span>}</span>
        </div>
    </div>)
}
