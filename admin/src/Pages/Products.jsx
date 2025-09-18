import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../Components/Navbar";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/admin/products");
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  const handleDelete = async () => {
    try {
      await api.delete("/admin/delete-product", {
        data: { id: selectedId },
      });
      setProducts(products.filter((p) => p.id !== selectedId));
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus produk ❌");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between">
          <h2>Products</h2>
          <a href="/admin/add-product" className="btn btn-outline-primary">
            + Add Product
          </a>
        </div>
        <table className="table table-striped table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Type</th>
              <th>Added By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  {p.productImage ? (
                    <img
                      src={`http://localhost:3000${p.productImage}`}
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
                  {p.user?.role === "admin" ? p.user.username : "Unknown"}
                </td>
                <td>
                  <a
                    type="button"
                    className="btn btn-info mb-3"
                    href={`/admin/products/${p.id}`}
                  >
                    Edit
                  </a>
                  <br />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setSelectedId(p.id);
                      setShowModal(true);
                    }}
                  >
                    Delete
                  </button>

                  {showModal && (
                    <div className="modal show d-block" tabIndex="-1">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Konfirmasi Hapus</h5>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={() => setShowModal(false)}
                            ></button>
                          </div>
                          <div className="modal-body">
                            <p>Apakah kamu yakin ingin menghapus produk ini?</p>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setShowModal(false)}
                            >
                              Batal
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={handleDelete}
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
