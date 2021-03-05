import React, { FC } from 'react';
import { Button } from 'primereact/button';
import { dispatch } from 'ajwah-reactive-form';
import { Product, actionType as at } from '../../models';

interface Props {
    product: Product
}
export const ProductCom: FC<Props> = ({ product }) => {


    function showDialog(flag: boolean) {
        dispatch(at.ProductDialogAction, true);
        dispatch(at.ProductDetails, product);
    }

    return (

        <div className="p-col-12 p-md-4">
            <div className="product-grid-item card">
                <div className="product-grid-item-top">
                    <img src={`https://backendapi.turing.com/images/products/${product?.thumbnail}`} alt={product.name} />
                    <div className="p-text-bold">{product.name}</div>
                </div>
                <div className="product-grid-item-content">
                    <div className="p-d-flex p-jc-between">
                        <div className="discount">{product.discounted_price === "0.00" ? null : "$" + product.price}</div>
                        <div>
                            <Button onClick={() => showDialog(true)} icon="pi pi-shopping-cart" className="p-button-rounded p-button-outlined p-button-sm"
                                label={product.discounted_price === "0.00" ? "$" + product.price : "$" + product.discounted_price}
                            />
                        </div>
                    </div>
                </div>
                <div className="product-grid-item-bottom">
                    {product.description}
                </div>
            </div>
        </div>

    )

}