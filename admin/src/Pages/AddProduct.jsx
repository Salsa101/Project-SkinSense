import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [ingredientResults, setIngredientResults] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleSearchIngredient = async (e) => {
    const q = e.target.value;
    setIngredientSearch(q);

    if (q.length < 2) {
      setIngredientResults([]);
      return;
    }

    try {
      const res = await api.get(`/admin/ingredients?search=${q}`);
      setIngredientResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addIngredientToList = (ingredient) => {
    if (!selectedIngredients.some((i) => i.id === ingredient.id)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const removeIngredient = (id) => {
    setSelectedIngredients(selectedIngredients.filter((i) => i.id !== id));
  };

  const navigate = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    productBrand: "",
    productType: "",
    shelf_life_months: "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedIngredients.length === 0) {
      alert("Please select at least one ingredient!");
      return;
    }

    const formData = new FormData();
    formData.append("productName", form.productName);
    formData.append("productBrand", form.productBrand);
    formData.append("productType", form.productType);
    formData.append("shelf_life_months", form.shelf_life_months);
    formData.append(
      "ingredients",
      JSON.stringify(selectedIngredients.map((i) => i.id))
    );

    if (file) formData.append("productImage", file);

    try {
      await api.post("/admin/add-product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="container my-4">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input
            type="text"
            name="productName"
            className="form-control"
            value={form.productName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Brand</label>
          <input
            type="text"
            name="productBrand"
            className="form-control"
            value={form.productBrand}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            name="productType"
            className="form-control"
            value={form.productType}
            onChange={handleChange}
            required
          >
            <option value="">-- Pilih Type --</option>
            <option value="cleanser">Cleanser</option>
            <option value="sunscreen">Sunscreen</option>
            <option value="toner">Toner</option>
            <option value="serum">Serum</option>
            <option value="moisturizer">Moisturizer</option>
            <option value="mask">Mask</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">PAO (months)</label>
          <input
            type="number"
            name="shelf_life_months"
            className="form-control"
            value={form.shelf_life_months}
            onChange={handleChange}
            placeholder="ex: 12"
            min="1"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        {/* SEARCH INGREDIENT */}
        <div className="mb-3">
          <label className="form-label">Search Ingredient</label>
          <input
            type="text"
            className="form-control"
            value={ingredientSearch}
            onChange={handleSearchIngredient}
            placeholder="Search ingredient..."
            required
          />

          {/* SEARCH RESULT */}
          {ingredientResults.length > 0 && (
            <div
              className="border p-2 mt-2"
              style={{ maxHeight: "150px", overflowY: "auto" }}
            >
              {ingredientResults.map((ing) => (
                <div
                  key={ing.id}
                  className="p-1"
                  style={{ cursor: "pointer" }}
                  onClick={() => addIngredientToList(ing)}
                >
                  ✔ {ing.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SELECTED INGREDIENTS */}
        <div className="mb-3">
          <label className="form-label">Selected Ingredients</label>
          <div className="border p-2">
            {selectedIngredients.length === 0 && (
              <small>No ingredients selected.</small>
            )}

            {selectedIngredients.map((ing) => (
              <div
                key={ing.id}
                className="d-flex justify-content-between align-items-center border-bottom py-1"
              >
                <span>{ing.name}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeIngredient(ing.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
