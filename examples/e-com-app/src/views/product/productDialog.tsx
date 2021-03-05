import React from "react";
import { Dialog } from "primereact/dialog";
import { action$ } from "ajwah-reactive-form";
import { actionType as at } from "../../models";
import { useMobileActive, useActionStream } from "../hooks";
import { debounceTime, pluck } from "rxjs/operators";
import { ProductDetails } from "./productDetails";


export const ProductDialog = () => {
  const [visible, setVisible] = useActionStream<boolean>(
    action$.whereType(at.ProductDialogAction).pipe(debounceTime(10), pluck("payload")),
    false
  );
  const mobileActive = useMobileActive();

  function showDialog(flag: boolean) {
    setVisible(flag);
  }
  return (
    <Dialog
      header="Product Details"
      visible={visible}
      style={{ width: mobileActive ? "100vw" : "70vw" }}
      onHide={() => showDialog(false)}
    >
      <ProductDetails />
    </Dialog>
  );
};
