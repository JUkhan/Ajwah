import React, { useState, FC } from "react";
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider'
interface Props {
  image1: string,
  image2: string
}

export const ImageViewer: FC<Props> = ({ image1, image2 }) => {

  const [image, setImage] = useState(image1);

  return (
    <div className="p-text-center image-viewer">
      <div className="box">
        <img
          alt=""
          src={`https://backendapi.turing.com/images/products/${image}`}
        />
      </div>
      <Divider />

      <Button onClick={() => setImage(image1)} className="p-button-text" >
        <Avatar image={`https://backendapi.turing.com/images/products/${image1}`} />
      </Button>
     {image2 && <Button onClick={() => setImage(image2)} className="p-button-text" >
        <Avatar image={`https://backendapi.turing.com/images/products/${image2}`} />
      </Button>}
    </div>

  );
}
