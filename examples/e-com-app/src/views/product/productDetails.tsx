import React, { useState, FC } from "react";
import { Button } from "primereact/button";
import { dispatch, action$ } from "ajwah-reactive-form";
import { ImageViewer } from "./imageViewer";
import { Review } from "./review";
import { useMobileActive, useActionStream, usePullData } from "../hooks";
import { ProductDetail, actionType as at, Product } from "../../models";
import { pluck } from "rxjs/operators";
import { classNames } from "../../utils";


interface Attribute {
  attribute_name: string;
  attribute_value_id: number;
  attribute_value: string;
}
interface ColorSize {
  color: string;
  size: string;
}
export const ProductDetails = () => {
  const [{ product_id }] = useActionStream<Product>(
    action$.whereType(at.ProductDetails).pipe(pluck("payload")),
    { product_id: 0 } as Product
  );

  const [cs, setColorSize] = useState({} as ColorSize);

  const [attributes] = usePullData<Attribute[]>(
    `attributes/inProduct/${product_id}`,
    [],
    product_id === 0
  );
  const mobileActive = useMobileActive();
  const [data] = usePullData<ProductDetail[]>(
    `products/${product_id}/details`,
    [],
    product_id === 0
  );

  if (data.length === 0) return <h3>loading...</h3>;

  const { name, description, price, discounted_price, image, image_2 } = data[0];
  const colors = attributes.filter(item => item.attribute_name === "Color");
  const sizes = attributes.filter(item => item.attribute_name === "Size");

  function addToCart() {
    dispatch(at.AddToCart, { productId: product_id, ...cs });
    dispatch(at.ProductDialogAction, false);
  }

  function setColor(color: string) {
    setColorSize({ ...cs, color });
  }
  function setSize(size: string) {
    setColorSize({ ...cs, size });
  }

  return (
    <div className="p-grid">
      <div
        className={classNames({
          "p-col-12": mobileActive,
          "p-col-4": !mobileActive
        })}
      >
        {image && <ImageViewer image1={image} image2={image_2} />}
      </div>
      <div
        className={classNames({
          "p-col-12": mobileActive,
          "p-col-8": !mobileActive
        })}
      >
        <h3 className="p-text-center p-mt-2">{name}</h3>
        <div className="p-d-flex p-jc-between p-m-2 p-text-bold">
          <span className="discount">
            {discounted_price === "0.00" ? null : "$" + price}
          </span>
          <span style={{ color: "red" }}>
            {discounted_price === "0.00" ? "$" + price : "$" + discounted_price}
          </span>
        </div>

        <p>{description}</p>
        <div className="p-mb-2">Color</div>
        <div className="p-d-flex p-flex-wrap">
          {colors.map(item => (
            <div className="p-mr-2 p-mb-2" key={item.attribute_value}>
              <Button
                icon={classNames({
                  "pi pi-check": cs.color === item.attribute_value
                })}
                className="p-button-rounded p-button-outlined"
                onClick={() => setColor(item.attribute_value)}
                style={{ backgroundColor: item.attribute_value }}
              >
                {" "}
                &nbsp;
              </Button>
            </div>
          ))}
        </div>
        <div />
        <div className="p-mb-2">Size</div>
        <div className="p-d-flex p-flex-wrap">
          {sizes.map(item => (
            <div className="p-mr-2 p-mb-2" key={item.attribute_value}>
              <Button
                style={{ width: 70 }}
                icon={classNames("pi", {
                  "pi-check": cs.size === item.attribute_value
                })}
                className="p-button-outlined"
                onClick={() => setSize(item.attribute_value)}
              >
                {item.attribute_value}
              </Button>
            </div>
          ))}
        </div>
        <div className="p-text-center p-mt-2">
          <Button
            disabled={!(cs.size && cs.color)}
            onClick={addToCart}
            type="default"
            shape="round"
          >
            Add to Cart
          </Button>
        </div>
      </div>
      <div className="p-col-12">
        {product_id && <Review productId={product_id} />}
      </div>
    </div>
  );
};
