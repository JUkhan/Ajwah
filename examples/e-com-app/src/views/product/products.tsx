import React from "react";
import { DataView } from "primereact/dataview";
import { useStream, dispatch } from "ajwah-reactive-form";
import { ProductController } from "../../controllers";
import { actionType as at, Product } from "../../models";
import { ProductCom } from "./product";
import { ProductDialog } from './productDialog';


export function Products() {

  const [productState] = useStream(ProductController, con => con.stream$, con => con.state);

  const itemTemplate = (product: Product) => {
    if (product === null) return <div />;
    return <ProductCom product={product} />;
  };

  const first = (productState.pageNo - 1) * 10;
  return (
    <div className="card">
      <DataView
        value={productState.rows}
        layout="grid"
        itemTemplate={itemTemplate}
        lazy
        paginator
        paginatorPosition="both"
        rows={10}
        loading={productState.loading}
        totalRecords={productState.total}
        first={first}
        onPage={onPageChange}
      />
      <ProductDialog />
    </div>
  );
}

function onPageChange(event: any) {
  dispatch(at.PageChange, {
    pageNo: event.originalEvent.page + 1,
    pageSize: event.rows
  });
}
