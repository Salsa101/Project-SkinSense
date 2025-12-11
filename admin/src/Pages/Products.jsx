import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../Components/Navbar";
import { FaEdit, FaTrash } from "react-icons/fa";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // filter state
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState(""); // "", "true", "false"

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/admin/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading products...
      </div>
    );

  const handleDelete = async () => {
    try {
      await api.delete("/admin/delete-product", {
        data: { id: selectedId },
      });
      setProducts(products.filter((p) => p.id !== selectedId));
      setShowModal(false);
      alert("Product deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  // filter logic
  const filteredProducts = products.filter((p) => {
    const matchSearch = search
      ? p.productName.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchBrand = brandFilter ? p.productBrand === brandFilter : true;
    const matchType = typeFilter ? p.productType === typeFilter : true;
    const matchVerified =
      verifiedFilter === ""
        ? true
        : verifiedFilter === "true"
        ? p.isVerified === true
        : p.isVerified === false;

    return matchSearch && matchBrand && matchType && matchVerified;
  });

  // ambil list unik brand & type untuk dropdown
  const uniqueBrands = [...new Set(products.map((p) => p.productBrand))];
  const uniqueTypes = [...new Set(products.map((p) => p.productType))];

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2>Products</h2>
            <p style={{ color: "red" }}>
              Don't forget to add ingredient first!
            </p>
          </div>
          <a href="/admin/add-product" className="btn btn-outline-primary">
            + Add Product
          </a>
        </div>

        {/* Filter & Search */}
        <div className="row mb-3">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
            >
              <option value="">All Brands</option>
              {uniqueBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              {uniqueTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </div>
        </div>

        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>No</th>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Type</th>
              <th>Ingredients</th>
              <th>Added By</th>
              <th>Verified</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p, index) => (
              <tr key={p.id}>
                <td>{filteredProducts.length - index}</td>
                <td>{p.id}</td>
                <td>
                  {p.productImage ? (
                    <img
                      src={p.productImage}
                      alt={p.productName}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{p.productName}</td>
                <td>{p.productBrand}</td>
                <td>{p.productType}</td>
                <td>
                  {p.Ingredients && p.Ingredients.length > 0 ? (
                    <ul style={{ paddingLeft: "15px", margin: 0 }}>
                      {p.Ingredients.map((ing) => (
                        <li key={ing.id}>{ing.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <small>No ingredients</small>
                  )}
                </td>
                <td>
                  {p.user?.role === "admin" ? p.user.username : "Unknown"}
                </td>
                <td>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={p.isVerified}
                      onChange={async (e) => {
                        try {
                          const newVal = e.target.checked;
                          await api.put(`/admin/products/${p.id}/verify`, {
                            isVerified: newVal,
                          });
                          setProducts(
                            products.map((prod) =>
                              prod.id === p.id
                                ? { ...prod, isVerified: newVal }
                                : prod
                            )
                          );
                        } catch (err) {
                          console.error(err);
                          alert(
                            "Failed to update status verified. Please try again."
                          );
                        }
                      }}
                    />
                  </div>
                </td>
                <td>
                  <a
                    type="button"
                    className="btn btn-sm btn-info me-2"
                    href={`/admin/products/${p.id}`}
                    title="Edit"
                  >
                    <FaEdit />
                  </a>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    title="Delete"
                    onClick={() => {
                      setSelectedId(p.id);
                      setShowModal(true);
                    }}
                  >
                    <FaTrash />
                  </button>

                  {showModal && (
                    <>
                      {/* Overlay gelap */}
                      <div
                        className="modal-backdrop fade show"
                        style={{
                          zIndex: 1040,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }}
                        onClick={() => setShowModal(false)}
                      ></div>
                      <div className="modal show d-block" tabIndex="-1">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">
                                Delete Confirmation
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowModal(false)}
                              ></button>
                            </div>
                            <div className="modal-body">
                              <p>
                                Are you sure you want to delete this product?
                                This action cannot be undone.
                              </p>
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDelete}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;
