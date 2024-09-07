import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Layout from "./Layout";
import AdminLayout from "./pages/Admin/Layout";
import Dashboard from "./pages/Admin/Dashboard";
import Users from "./pages/Admin/Users";
import Events from "./pages/Admin/Events";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="admin" element={<AdminLayout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="events" element={<Events />} />
          <Route path="orders" element={<h1>Orders</h1>} />
          <Route path="categories" element={<h1>Categories</h1>} />
        </Route>

        <Route path="*" element={<h1>Not Found</h1>} />
      </Route>
    </Routes>
  );
};

export default App;