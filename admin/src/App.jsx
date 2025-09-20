import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Products from "./Pages/Products";
import ProtectedRoute from "./api/ProtectedRoute";
import AddProduct from "./Pages/AddProduct";
import EditProduct from "./Pages/EditProduct";
import News from "./Pages/News";
import AddNews from "./Pages/AddNews";
import Categories from "./Pages/Categories";
import AddCategory from "./Pages/AddCategory";
import EditCategory from "./Pages/EditCategory";
import EditNews from "./Pages/EditNews";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news"
          element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news/add"
          element={
            <ProtectedRoute>
              <AddNews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news/:id"
          element={
            <ProtectedRoute>
              <EditNews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories/add"
          element={
            <ProtectedRoute>
              <AddCategory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories/:id"
          element={
            <ProtectedRoute>
              <EditCategory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
