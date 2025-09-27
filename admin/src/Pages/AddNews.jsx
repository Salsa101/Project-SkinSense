import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function AddNews() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    categoryIds: [],
  });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);

  // Ambil list kategori
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/admin/categories");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Handle input biasa
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);

    form.categoryIds.forEach((id) =>
      formData.append("categoryIds[]", parseInt(id))
    );

    if (file) formData.append("newsImage", file);

    try {
      await api.post("/admin/news/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("News added successfully!");
      navigate("/admin/news");
    } catch (err) {
      console.error(err);
      alert("Failed to add news.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add News</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Content */}
        <div className="mb-3">
          <label className="form-label">Content</label>
          <ReactQuill
            theme="snow"
            value={form.content}
            onChange={(value) => setForm({ ...form, content: value })}
            style={{ height: "200px", marginBottom: "50px" }}
          />
        </div>

        {/* Category */}
        <div className="mb-3">
          <label className="form-label">Category</label>
          {categories
            .filter((c) => c.isActive)
            .map((c) => (
              <div key={c.id} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={c.id}
                  checked={form.categoryIds.includes(c.id.toString())}
                  onChange={(e) => {
                    const id = e.target.value;
                    setForm({
                      ...form,
                      categoryIds: form.categoryIds.includes(id)
                        ? form.categoryIds.filter((i) => i !== id)
                        : [...form.categoryIds, id],
                    });
                  }}
                />
                <label className="form-check-label">{c.name}</label>
              </div>
            ))}
        </div>

        {/* Image */}
        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Add News
        </button>
      </form>
    </div>
  );
}

export default AddNews;
