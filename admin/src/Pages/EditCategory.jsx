import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/admin/categories/${id}`);
        setForm({ name: res.data.name });
      } catch (err) {
        console.error(err);
        alert("Failed to load category data.");
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/admin/categories/edit/${id}`, form);
      alert("Category updated successfully!");
      navigate("/admin/categories");
    } catch (err) {
      console.error(err);
      alert("Failed to update category. Please try again.");
    }
  };

  return (
    <div className="container my-4">
      <h2>Edit Category</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Category
        </button>
      </form>
    </div>
  );
}

export default EditCategory;
