import React, { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../Components/Navbar";
import { FaEdit, FaTrash } from "react-icons/fa";

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await api.get("/admin/ingredients");
        setIngredients(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  if (loading) return <p>Loading ingredients...</p>;

  const handleDelete = async () => {
    try {
      await api.delete("/admin/ingredients/delete", {
        data: { id: selectedId },
      });
      setIngredients(ingredients.filter((i) => i.id !== selectedId));
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus ingredient ❌");
    }
  };

  const filteredIngredients = ingredients.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

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

        <div className="row mb-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search ingredient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>For Sensitive?</th>
              <th>Texture Oily?</th>
              <th>Weight</th>
              <th>Skin Types</th>
              <th>Tags</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredIngredients.map((ing) => (
              <tr key={ing.id}>
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
                              <p>Yakin ingin menghapus ingredient ini?</p>
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
