import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Occasions } from "../../components/Filters/Occasions";
import { SleeveLength } from "../../components/Filters/SleeveLength";
import { Materials } from "../../components/Filters/Materials";
const { Option } = Select;


const UpdateProduct = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [rent, setRent] = useState("");
    const [photo, setPhoto] = useState("");
    const [color, setColor] = useState("");
    const [occasion, setOccasion] = useState("");
    const [sleeve, setSleeve] = useState("");
    const [material, setMaterial] = useState("");
    const [brand, setBrand] = useState("");
    const [id, setId] = useState("")

    
    //get single product
    const getSingleProduct = async () => {
        try {
            const {data} = await axios.get(`/api/v1/product/get-product/${params.slug}`)
            setName(data.product.name);
            setId(data.product._id)
            setDescription(data.product.description);
            setPrice(data.product.price);
            setQuantity(data.product.quantity);
            setRent(data.product.rent);
            setCategory(data.product.category._id);
            setColor(data.product.color)
            setOccasion(data.product.occasion)
            setSleeve(data.product.sleeve)
            setMaterial(data.product.material)
            setBrand(data.product.brand._id)
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        getSingleProduct();
        // eslint-disable-next-line
    }, [])

    //get all category
    const getAllCategory = async () => {
      try {
        const { data } = await axios.get("/api/v1/category/get-category");
        if (data?.success) {
          setCategories(data?.category);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something wwent wrong in getting catgeory");
      }
    };

    const getAllBrand = async () => {
      try {
        const { data } = await axios.get("/api/v1/brand/get-brand");
        if (data?.success) {
          setBrands(data?.brand);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong in getting brand");
      }
    };
  
    useEffect(() => {
      getAllCategory();
      getAllBrand();
    }, []);
  
    //create product function
    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        const productData = new FormData();
        productData.append("name", name);
        productData.append("description", description);
        productData.append("price", price);
        productData.append("quantity", quantity);
        photo && productData.append("photo", photo);
        productData.append("category", category);
        productData.append("color", color);
        productData.append("occasion", occasion);
        productData.append("sleeve", sleeve);
        productData.append("material", material);
        productData.append("brand", brand);

        const { data } = axios.put(
          `/api/v1/product/update-product/${id}`,
          productData
        );
        if (data?.success) {
          toast.error(data?.message);
        } else {
          toast.success("Product Updated Successfully");
          navigate("/dashboard/admin/products");
        }
      } catch (error) {
        console.log(error);
        toast.error("something went wrong");
      }
    };

    //handleDelete
    const handleDelete = async () => {
        try {
            let answer = window.prompt('Are you sure you want to delete this item?')
            if (!answer) return;
            const {data} = await axios.delete(`/api/v1/product/delete-product/${id}`)
            toast.success('Product Deleted')
            navigate("/dashboard/admin/products");
        } catch (error) {
            console.log(error)
            toast.error('Something is wrong')
        }
    }
  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product</h1>
            <div className="m-1 w-75">
              <Select
                variant={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setCategory(value);
                }}
                value={category}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>
              <div className="mb-3">
                {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                ) :(
                    <div className="text-center">
                    <img
                      src={`/api/v1/product/product-photo/${id}`}
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="write a name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="write a description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Select
                variant={false}
                placeholder="Select the brand"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setBrand(value);
                }}
                value={brand}
              >
                {brands?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>


              <Select
                variant={false}
                placeholder="Select the occasion"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setOccasion(value);
                }}
                value={occasion}
              >
                {Occasions?.map((c) => (
                  <Option key={c._id} value={c.name}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              <Select
                variant={false}
                placeholder="Select the sleeve length"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setSleeve(value);
                }}
                value={sleeve}
              >
                {SleeveLength?.map((c) => (
                  <Option key={c._id} value={c.name}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="write a Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  value={color}
                  placeholder="write the color"
                  className="form-control"
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>

              <Select
                variant={false}
                placeholder="Select the material"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setMaterial(value);
                }}
                value={material}
              >
                {Materials?.map((c) => (
                  <Option key={c._id} value={c.name}>
                    {c.name}
                  </Option>
                ))}
              </Select>

              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="write a quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <Select
                  variant={false}
                  placeholder="Select rent option"
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setRent(value);
                  }}
                  value={rent ? "Yes" : "No"}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>

              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleUpdate}>
                  UPDATE PRODUCT
                </button>
              </div>
              <div className="mb-3">
                <button className="btn btn-danger" onClick={handleDelete}>
                  DELETE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default UpdateProduct
