import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../Components/Navbar";
import { FaEdit, FaTrash } from "react-icons/fa";

function News() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // filter state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get("/admin/news");
        setNewsList(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) return <p>Loading news...</p>;

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/news/delete/${selectedId}`);
      setNewsList(newsList.filter((n) => n.id !== selectedId));
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus news ❌");
    }
  };

  // filter logic
  const filteredNews = newsList.filter((n) => {
    const matchSearch = search
      ? n.title.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchCategory = categoryFilter
      ? n.Category?.name === categoryFilter
      : true;

    return matchSearch && matchCategory;
  });

  // ambil list unik kategori untuk dropdown
  const uniqueCategories = [...new Set(newsList.map((n) => n.Category?.name))];

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>News</h2>
          <a href="/admin/news/add" className="btn btn-outline-primary">
            + Add News
          </a>
        </div>

        {/* Filter & Search */}
        <div className="row mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredNews.map((n) => (
              <tr key={n.id}>
                <td>{n.id}</td>
                <td>
                  {n.newsImage ? (
                    <img
                      src={`http://localhost:3000/${n.newsImage}`}
                      alt={n.title}
                      style={{ width: "100px", height: "100px", objectFit: "contain" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{n.title}</td>
                <td>{n.Category?.name || "Unknown"}</td>
                <td>{new Date(n.createdAt).toLocaleDateString()}</td>
                <td>
                  <a
                    className="btn btn-sm btn-info me-2"
                    href={`/admin/news/${n.id}`}
                    title="Edit"
                  >
                    <FaEdit />
                  </a>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    title="Delete"
                    onClick={() => {
                      setSelectedId(n.id);
                      setShowModal(true);
                    }}
                  >
                    <FaTrash />
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
                            <p>Apakah kamu yakin ingin menghapus news ini?</p>
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

export default News;
