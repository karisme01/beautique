import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);

  // Get all products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };
 
  // Lifecycle method to fetch products
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            {/* <h1 className="text-center">All Products List</h1> */}
            <table className="table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <Link to={`/dashboard/admin/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                        {product._id}
                      </Link>
                    </td>
                    <td>
                      <Link to={`/dashboard/admin/product/${product.slug}`} style={{ textDecoration: 'none' }}>
                        {product.name}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
