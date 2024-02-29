import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";
import { useNavigate}  from "react-router-dom";

const Search = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  return (
    <Layout title={"Search results"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>
          <div className="row row-cols-1 row-cols-md-4">
            {values?.results.map((p) => (
              <div className="col mb-4" key={p._id} onClick={() => navigate(`/product/${p.slug}`)}>
                <div className="card shadow h-100">
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                    style={{ height: 300, cursor: 'pointer', transition: 'transform 0.3s'  }}
                  />
                  <div className="card-body" style={{textAlign: 'left'}}>
                    <h5 className="card-title" style={{fontSize: '12px', marginBottom: '0px', marginTop: '-17px'}}>{p.name}</h5>
                    <p className="card-text" style={{marginBottom: '-10px', marginTop: '0px'}}>
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
