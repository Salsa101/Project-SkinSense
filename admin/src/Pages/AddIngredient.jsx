import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";

function AddIngredient() {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [existingTags, setExistingTags] = useState([]);

  const [form, setForm] = useState({
    name: "",
    isSensitive: false,
    isOily: false,
    weight: "",
    skinTypes: [],
    tags: "",
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get("/admin/ingredients");

        const allIngredients = res.data;

        const allTags = allIngredients.flatMap((i) => {
          if (!i.tags) return [];

          // jika format Postgres: "{a,b,c}"
          if (typeof i.tags === "string") {
            return i.tags
              .replace("{", "")
              .replace("}", "")
              .split(",")
              .map((t) => t.trim());
          }

          return i.tags;
        });

        const uniqueTags = [...new Set(allTags)];

        setExistingTags(uniqueTags);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };

    fetchTags();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // === SKIN TYPES ===
    if (type === "checkbox" && name.startsWith("skin_")) {
      const skinType = value;

      // Jika ALL dicentang
      if (skinType === "all") {
        setForm({
          ...form,
          skinTypes: checked ? ["all"] : [],
        });
        return;
      }

      // Jika ALL sedang aktif → checkbox lain nonaktif, jadi abaikan klik
      // Jika ALL aktif → hanya Sensitive yang boleh diubah
      if (form.skinTypes.includes("all") && skinType !== "Sensitive") {
        return;
      }

      // Normal add/remove
      let updated = [...form.skinTypes];
      if (checked) updated.push(skinType);
      else updated = updated.filter((s) => s !== skinType);

      setForm({ ...form, skinTypes: updated });
      return;
    }

    // === NORMAL CHECKBOX ===
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.skinTypes || form.skinTypes.length === 0) {
      alert("Please select at least one skin type!");
      return;
    }

    try {
      const payload = {
        ...form,
        tags: tags,
      };

      await api.post("/admin/ingredients/add", payload);
      alert("Ingredient added successfully.");
      navigate("/admin/ingredients");
    } catch (err) {
      console.error(err);
      alert("Failed to add ingredient.");
    }
  };

  return (
    <div className="container my-4">
      <h2>Add Ingredient</h2>
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

        {/* SKIN TYPES CHECKBOX */}
        <div className="mb-3">
          <label className="form-label">Skin Types</label>

          {/* ALL */}
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="skin_all"
              value="all"
              checked={form.skinTypes.includes("all")}
              onChange={handleChange}
            />
            <label className="form-check-label">All Skin Types</label>
          </div>

          {/* Checkbox lainnya */}
          {["Dry", "Oily", "Combination", "Normal", "Sensitive"].map((st) => (
            <div className="form-check" key={st}>
              <input
                className="form-check-input"
                type="checkbox"
                name={`skin_${st}`}
                value={st}
                checked={form.skinTypes.includes(st)}
                onChange={handleChange}
                disabled={form.skinTypes.includes("all") && st !== "Sensitive"}
              />
              <label className="form-check-label">{st}</label>
            </div>
          ))}
        </div>

        {/* TAGS (text input) */}
        <div className="mb-3">
          <label className="form-label">Tags</label>
          <CreatableSelect
            isMulti
            options={existingTags.map((t) => ({ label: t, value: t }))}
            value={tags.map((t) => ({ label: t, value: t }))}
            onChange={(selected) => setTags(selected.map((s) => s.value))}
            placeholder="Pilih atau tambahkan tag..."
          />

          <small className="text-danger d-block mt-1">
            ⚠️ Gunakan huruf kecil semua. Kalau 2 suku kata, pakai tanda strip
            (-). Contoh: <b>anti-acne</b>, <b>vitamin-c</b>.
          </small>
        </div>

        <button type="submit" className="btn btn-primary">
          Add Ingredient
        </button>
      </form>
    </div>
  );
}

export default AddIngredient;
