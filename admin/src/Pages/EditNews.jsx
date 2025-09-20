import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    categoryId: "",
  });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);

  // ambil list kategori aktif
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/admin/categories");
        // hanya kategori aktif
        setCategories(res.data.filter((c) => c.isActive));
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // ambil data news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get(`/admin/news/${id}`);
        setForm({
          title: res.data.title,
          content: res.data.content,
          categoryId: res.data.categoryId,
        });
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil data news.");
      }
    };
    fetchNews();
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
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("categoryId", form.categoryId);
    if (file) formData.append("newsImage", file);

    try {
      await api.put(`/admin/news/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("News berhasil diupdate!");
      navigate("/admin/news");
    } catch (err) {
      console.error(err);
      alert("Gagal update news.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit News</h2>
      <form onSubmit={handleSubmit} className="mt-3">
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

        <div className="mb-3">
          <label className="form-label">Content</label>
          <ReactQuill
            theme="snow"
            value={form.content}
            onChange={(value) => setForm({ ...form, content: value })}
            style={{ height: "200px", marginBottom: "50px" }}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            name="categoryId"
            className="form-select"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Update News
        </button>
      </form>
    </div>
  );
}

export default EditNews;
