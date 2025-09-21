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
    categoryIds: [],
  });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/admin/categories");
        setCategories(res.data.filter((c) => c.isActive));
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get(`/admin/news/${id}`);
        setForm({
          title: res.data.title,
          content: res.data.content,
          categoryIds: res.data.Categories?.map((c) => c.id) || [],
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

  const handleCheckboxChange = (categoryId, checked) => {
    if (checked) {
      setForm({ ...form, categoryIds: [...form.categoryIds, categoryId] });
    } else {
      setForm({
        ...form,
        categoryIds: form.categoryIds.filter((id) => id !== categoryId),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    form.categoryIds.forEach((id) => formData.append("categoryIds[]", id));
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
          <label className="form-label">Categories</label>
          <div>
            {categories.map((c) => (
              <div className="form-check form-check-inline" key={c.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`cat-${c.id}`}
                  value={c.id}
                  checked={form.categoryIds.includes(c.id)}
                  onChange={(e) => handleCheckboxChange(c.id, e.target.checked)}
                />
                <label className="form-check-label" htmlFor={`cat-${c.id}`}>
                  {c.name}
                </label>
              </div>
            ))}
          </div>
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
