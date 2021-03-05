import React, { FC } from 'react';
import { Button } from 'primereact/button';
import { CartItem as ItemType } from '../models';
import { dispatch } from 'ajwah-reactive-form';
import { actionType as at } from '../models';


interface Props {
    item: ItemType
}

export const CartItem: FC<Props> = ({ item }) => {

    return (

        <div className="p-col-12">
            <div className="product-list-item">
                <img src={`https://backendapi.turing.com/images/products/${item.image}`} onError={(e: any) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={item.name} />
                <div className="product-list-detail">
                    <div className="product-name">{item.name}</div>
                    <div className="product-description">{twistAttributes(item.attributes)}</div>
                    <Button className="p-button-outlined p-button-rounded p-button-sm" onClick={() => dispatch(at.RemoveCartItem, item.item_id)}  >Remove</Button>
                </div>
                <div className="product-list-action">

                    <span className="product-price">${item.subtotal}</span>
                    <span className="p-buttonset">
                        <Button icon="pi pi-plus" onClick={() => changeQuantity(item, 1)} />
                        <Button disabled shape="round">{item.quantity}</Button>
                        <Button icon="pi pi-minus" onClick={() => changeQuantity(item, -1)} />
                    </span>
                </div>
            </div>
        </div>


    );
}


function changeQuantity(item: ItemType, quantity: number) {
    dispatch(at.UpdateCartItem, { item, quantity });
}

function twistAttributes(attributes: string) {
    var arr = attributes.split(' ')
    return `Color: ${arr[0]}, Size: ${arr[1]}`
}