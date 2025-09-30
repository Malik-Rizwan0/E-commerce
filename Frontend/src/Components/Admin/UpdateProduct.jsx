import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";

import MetaData from "../layouts/MetaData";
import SideBar from "./Sidebar";
import {
  getProductDetails,
  updateProduct,
  clearErrors,
  resetUpdateProduct,
} from "../../features/productSlice";
import "./UpdateProduct.css";

const UpdateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id: productId } = useParams();

  const { product, error, loading, isUpdated } = useSelector(
    (state) => state.product
  );

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [Stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const categories = [
    "Laptop",
    "Footwear",
    "Bottom",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones",
  ];

  useEffect(() => {
    if (product && product._id !== productId) {
      dispatch(getProductDetails(productId));
    } else if (product) {
      setName(product.name || "");
      setDescription(product.description || "");
      setPrice(product.price || 0);
      setCategory(product.category || "");
      setStock(product.stock || 0);
      setOldImages(product.images || []);
    }

    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }

    if (isUpdated) {
      enqueueSnackbar("Product Updated Successfully", { variant: "success" });
      navigate("/admin/products");
      dispatch(resetUpdateProduct());
    }
  }, [dispatch, enqueueSnackbar, error, isUpdated, productId, product, navigate]);

  // Submit Handler
const updateProductSubmitHandler = (e) => {
  e.preventDefault();

  const myForm = new FormData();
  myForm.set("name", name);
  myForm.set("price", price);
  myForm.set("description", description);
  myForm.set("category", category);
  myForm.set("stock", Stock);

  // Send ONLY kept old images' public_ids
  myForm.set("oldImages", JSON.stringify(oldImages.map((img) => img.public_id)));

  // Send new images
  images.forEach((image) => {
    myForm.append("images", image);
  });

  dispatch(updateProduct({ id: productId, productData: myForm }));
};
  // Handle New Images Upload
  const updateProductImagesChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      setImages((old) => [...old, file]);

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });

    // allow re-uploading same file
    e.target.value = "";
  };

  // Remove Newly Added Image
  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };

const removeOldImage = (index) => {
  setOldImages((prev) => prev.filter((_, i) => i !== index));
};
  return (
    <Fragment>
      <MetaData title="Update Product" />
      <div className="dashboard">
        <SideBar />
        <div className="updateProductContainer">
          <form
            className="updateProductForm"
            encType="multipart/form-data"
            onSubmit={updateProductSubmitHandler}
          >
            <h1>Update Product</h1>

            <div className="formGroup">
              <label>Product Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="formGroup">
              <label>Price</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="formGroup">
              <label>Product Description</label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="formGroup">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Choose Category</option>
                {categories.map((cate) => (
                  <option key={cate} value={cate}>
                    {cate}
                  </option>
                ))}
              </select>
            </div>

            <div className="formGroup">
              <label>Stock</label>
              <input
                type="number"
                required
                value={Stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div className="formGroup">
              <label>Upload Images</label>
              <input
                type="file"
                name="images"
                accept="image/*"
                onChange={updateProductImagesChange}
                multiple
              />
            </div>

            {/* Old Images */}
            <div className="imagePreviewContainer">
              {oldImages &&
                oldImages.map((image, index) => (
                  <div key={index} className="previewWrapper">
                    <img src={image.url} alt="Old Preview" />
                    <button
                      type="button"
                      className="removeBtn"
                      onClick={() => removeOldImage(index)}
                    >
                      ❌
                    </button>
                  </div>
                ))}

              {/* New Images */}
              {imagesPreview.map((image, index) => (
                <div key={index} className="previewWrapper">
                  <img src={image} alt="Product Preview" />
                  <button
                    type="button"
                    className="removeBtn"
                    onClick={() => removeNewImage(index)}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>

            <button id="createProductBtn" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateProduct;
