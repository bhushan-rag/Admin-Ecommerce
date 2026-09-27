import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../Assets/upload_area.svg";
import { backend_url } from "../../config";

const AddProduct = () => {

  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: ""
  });

  const AddProduct = async () => {
    const { name, description, category, new_price, old_price } = productDetails;
    if (!name || !description || !new_price || !old_price) {
      alert("Please fill in all product details");
      return;
    }
    if (!image) {
      alert("Please select a product image");
      return;
    }

    try {
      let formData = new FormData();
      formData.append('product', image);

      const uploadResp = await fetch(`${backend_url}/upload`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });
      const uploadData = await uploadResp.json();
      if (!uploadData.success) {
        alert(uploadData.errors || "Image upload failed");
        return;
      }

      const product = {
        name,
        description,
        category,
        image: uploadData.image_url,
        new_price: Number(new_price),
        old_price: Number(old_price),
      };
      const addResp = await fetch(`${backend_url}/addproduct`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      const addData = await addResp.json();
      if (addData.success) {
        alert("Product Added");
        setProductDetails({ name: "", description: "", image: "", category: "women", new_price: "", old_price: "" });
        setImage(false);
      } else {
        alert(addData.errors || "Failed");
      }
    } catch (error) {
      alert("Unable to reach the server, please try again later");
    }
  }

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  }

  return (
    <div className="addproduct">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input type="text" name="name" value={productDetails.name} onChange={(e) => { changeHandler(e) }} placeholder="Type here" />
      </div>
      <div className="addproduct-itemfield">
        <p>Product description</p>
        <input type="text" name="description" value={productDetails.description} onChange={(e) => { changeHandler(e) }} placeholder="Type here" />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input type="number" name="old_price" value={productDetails.old_price} onChange={(e) => { changeHandler(e) }} placeholder="Type here" />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input type="number" name="new_price" value={productDetails.new_price} onChange={(e) => { changeHandler(e) }} placeholder="Type here" />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product category</p>
        <select value={productDetails.category} name="category" className="add-product-selector" onChange={changeHandler}>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <p>Product image</p>
        <label htmlFor="file-input">
          <img className="addproduct-thumbnail-img" src={!image ? upload_area : URL.createObjectURL(image)} alt="" />
        </label>
        <input onChange={(e) => setImage(e.target.files[0])} type="file" name="image" id="file-input" accept="image/*" hidden />
      </div>
      <button className="addproduct-btn" onClick={() => { AddProduct() }}>ADD</button>
    </div>
  );
};

export default AddProduct;
