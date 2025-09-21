import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function AddCategory() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/categories/add", form);
      alert("Category added successfully!");
      navigate("/admin/categories"); // redirect ke halaman list category
    } catch (err) {
      console.error(err);
      alert("Failed to add category.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Category</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter category name"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add Category
        </button>
      </form>
    </div>
  );
}

export default AddCategory;