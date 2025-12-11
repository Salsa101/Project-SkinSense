import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../Components/Navbar";
import { FaEdit, FaTrash } from "react-icons/fa";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [sensitiveFilter, setSensitiveFilter] = useState("");
  const [skinTypeFilter, setSkinTypeFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await api.get("/admin/ingredients");
        setIngredients(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load ingredient data.");
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
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
        Loading ingredients...
      </div>
    );

  const handleDelete = async () => {
    try {
      await api.delete("/admin/ingredients/delete", {
        data: { id: selectedId },
      });
      setIngredients(ingredients.filter((i) => i.id !== selectedId));
      setShowModal(false);
      alert("Ingredient deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete ingredient. Please try again.");
    }
  };

  const uniqueSkinTypes = [
    ...new Set(ingredients.flatMap((i) => i.skinTypes || [])),
  ];

  // Filter ingredients
  const filteredIngredients = ingredients.filter((i) => {
    const searchLower = search.toLowerCase();

    const matchSearch =
      i.name.toLowerCase().includes(searchLower) ||
      (i.tags?.some((t) => t.toLowerCase().includes(searchLower)) ?? false);

    const matchSensitive =
      sensitiveFilter === ""
        ? true
        : sensitiveFilter === "true"
        ? i.isSensitive
        : !i.isSensitive;

    const matchSkinType =
      skinTypeFilter === "" ? true : i.skinTypes?.includes(skinTypeFilter);

    return matchSearch && matchSensitive && matchSkinType;
  });

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Ingredients</h2>
          <a href="/admin/ingredients/add" className="btn btn-outline-primary">
            + Add Ingredient
          </a>
        </div>

        {/* Search & Filter */}
        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search ingredient or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={sensitiveFilter}
              onChange={(e) => setSensitiveFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Sensitive</option>
              <option value="false">Not Sensitive</option>
            </select>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={skinTypeFilter}
              onChange={(e) => setSkinTypeFilter(e.target.value)}
            >
              <option value="">All Skin Types</option>
              {uniqueSkinTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>No</th>
              <th>ID</th>
              <th>Name</th>
              <th>For Sensitive?</th>
              <th>For Oily?</th>
              <th>Weight</th>
              <th>Skin Types</th>
              <th>Tags</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredIngredients.map((ing, index) => (
              <tr key={ing.id}>
                <td>{filteredIngredients.length - index}</td>
                <td>{ing.id}</td>
                <td>{ing.name}</td>
                <td>{ing.isSensitive ? "Yes" : "No"}</td>
                <td>{ing.isOily ? "Yes" : "No"}</td>
                <td>{ing.weight}</td>
                <td>{ing.skinTypes?.join(", ")}</td>
                <td>{ing.tags?.join(", ")}</td>
                <td>
                  <div className="d-flex align-items-center gap-1">
                    <a
                      className="btn btn-sm btn-info me-2"
                      href={`/admin/ingredients/${ing.id}`}
                      title="Edit"
                    >
                      <FaEdit />
                    </a>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        setSelectedId(ing.id);
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
                                  Are you sure you want to delete this
                                  ingredient? This action cannot be undone.
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Ingredients;
