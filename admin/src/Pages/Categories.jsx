import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../Components/Navbar";
import { FaEdit } from "react-icons/fa";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/admin/categories");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load category data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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
        Loading categories...
      </div>
    );

  const filteredCategories = categories.filter((c) =>
    search ? c.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Categories</h2>
          <a href="/admin/categories/add" className="btn btn-outline-primary">
            + Add Category
          </a>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>No</th>
              <th>ID</th>
              <th>Name</th>
              <th>Is Active</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((c, index) => (
              <tr key={c.id}>
                <td>{filteredCategories.length - index}</td>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={c.isActive}
                      onChange={async (e) => {
                        try {
                          const newVal = e.target.checked;
                          await api.put(`/admin/categories/${c.id}/isactive`, {
                            isActive: newVal,
                          });
                          setCategories(
                            categories.map((cat) =>
                              cat.id === c.id
                                ? { ...cat, isActive: newVal }
                                : cat
                            )
                          );
                        } catch (err) {
                          console.error(err);
                          alert(
                            "Failed to update category status. Please try again."
                          );
                        }
                      }}
                    />
                  </div>
                </td>

                <td>
                  <a
                    className="btn btn-sm btn-info me-2"
                    href={`/admin/categories/${c.id}`}
                    title="Edit"
                  >
                    <FaEdit />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Categories;
