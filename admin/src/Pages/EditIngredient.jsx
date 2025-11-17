import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

function EditIngredient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    isSensitive: false,
    isOily: false,
    weight: "",
    skinTypes: [],
    tags: "",
  });

  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        const res = await api.get(`/admin/ingredients/${id}`);

        setForm({
          name: res.data.name,
          isSensitive: res.data.isSensitive,
          isOily: res.data.isOily,
          weight: res.data.weight,
          skinTypes: res.data.skinTypes
            ? res.data.skinTypes.map((s) => {
                if (s.toLowerCase() === "all") return "All Skin Types";
                return s.charAt(0).toUpperCase() + s.slice(1);
              })
            : [],
          tags: res.data.tags ? res.data.tags.join(", ") : "",
        });
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil data ingredient.");
      } finally {
        setLoading(false);
      }
    };

    fetchIngredient();
  }, [id]);

  const isAllActive = form.skinTypes.includes("All Skin Types");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // HANDLE SKIN TYPES
    if (type === "checkbox" && name.startsWith("skin_")) {
      const skinType = value;

      // Jika user mengaktifkan All Skin Types
      if (skinType === "All Skin Types" && checked) {
        setForm({
          ...form,
          skinTypes: [
            "All Skin Types",
            ...(form.skinTypes.includes("Sensitive") ? ["Sensitive"] : []),
          ],
        });
        return;
      }

      // Jika user mematikan All Skin Types
      if (skinType === "All Skin Types" && !checked) {
        setForm({
          ...form,
          skinTypes: form.skinTypes.filter((s) => s !== "All Skin Types"),
        });
        return;
      }

      // Kalau All aktif → lock semua kecuali Sensitive
      if (isAllActive && skinType !== "Sensitive") return;

      // Normal behaviour
      let updated = [...form.skinTypes];
      if (checked) updated.push(skinType);
      else updated = updated.filter((s) => s !== skinType);

      setForm({ ...form, skinTypes: updated });
      return;
    }

    // NORMAL CHECKBOXES (Sensitive/Oily flags)
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      skinTypes: form.skinTypes.map((st) => {
        if (st === "All Skin Types") return "all";
        return st.toLowerCase();
      }),
      tags: form.tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0),
    };

    try {
      await api.put(`/admin/ingredients/update/${id}`, payload);
      alert("Ingredient updated!");
      navigate("/admin/ingredients");
    } catch (err) {
      console.error(err);
      alert("Gagal update ingredient.");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container my-4">
      <h2>Edit Ingredient</h2>
      <form className="mt-3" onSubmit={handleSubmit}>
        {/* NAME */}
        <div className="mb-3">
          <label className="form-label">Ingredient Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* CHECKBOXES */}
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            name="isSensitive"
            checked={form.isSensitive}
            onChange={handleChange}
          />
          <label className="form-check-label">Sensitive Skin Friendly</label>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="isOily"
            checked={form.isOily}
            onChange={handleChange}
          />
          <label className="form-check-label">Suitable for Oily Skin</label>
        </div>

        {/* WEIGHT */}
        <div className="mb-3">
          <label className="form-label">Weight (0 - 1)</label>
          <input
            type="number"
            name="weight"
            step="0.01"
            min="0"
            max="1"
            className="form-control"
            value={form.weight}
            onChange={handleChange}
            required
          />
        </div>

        {/* SKIN TYPES */}
        <div className="mb-3">
          <label className="form-label">Skin Types</label>

          {[
            "All Skin Types",
            "Dry",
            "Oily",
            "Combination",
            "Normal",
            "Sensitive",
          ].map((st) => (
            <div className="form-check" key={st}>
              <input
                className="form-check-input"
                type="checkbox"
                name={`skin_${st}`}
                value={st}
                checked={form.skinTypes.includes(st)}
                onChange={handleChange}
                disabled={
                  isAllActive && st !== "All Skin Types" && st !== "Sensitive"
                }
              />
              <label className="form-check-label">{st}</label>
            </div>
          ))}
        </div>

        {/* TAGS */}
        <div className="mb-3">
          <label className="form-label">Tags (pisahkan dengan koma)</label>
          <input
            type="text"
            name="tags"
            className="form-control"
            placeholder="cth: hydrating, anti-acne"
            value={form.tags}
            onChange={handleChange}
          />
          <small className="text-danger d-block mt-1">
            ⚠️ Gunakan huruf kecil semua dan pakai strip (-) untuk 2 kata.
          </small>
        </div>

        <button type="submit" className="btn btn-primary">
          Update Ingredient
        </button>
      </form>
    </div>
  );
}

export default EditIngredient;
