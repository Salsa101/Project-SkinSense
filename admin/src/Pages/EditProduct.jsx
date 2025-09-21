import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    productBrand: "",
    productType: "",
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/admin/products/${id}`);
        setForm({
          productName: res.data.productName,
          productBrand: res.data.productBrand,
          productType: res.data.productType,
        });
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil data produk.");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", form.productName);
    formData.append("productBrand", form.productBrand);
    formData.append("productType", form.productType);
    if (file) formData.append("productImage", file);

    try {
      await api.put(`/admin/products/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Produk berhasil diupdate!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Gagal update produk.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            name="productName"
            className="form-control"
            value={form.productName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Brand</label>
          <input
            type="text"
            name="productBrand"
            className="form-control"
            value={form.productBrand}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            name="productType"
            className="form-control"
            value={form.productType}
            onChange={handleChange}
          >
            <option value="">-- Pilih Type --</option>
            <option value="cleanser">Cleanser</option>
            <option value="sunscreen">Sunscreen</option>
            <option value="toner">Toner</option>
            <option value="serum">Serum</option>
            <option value="moisturizer">Moisturizer</option>
            <option value="mask">Mask</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input type="file" className="form-control" onChange={handleFileChange} />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Product
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
