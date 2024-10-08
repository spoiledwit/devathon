import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Layout from "./Layout";
import AdminLayout from "./pages/Admin/Layout";
import Dashboard from "./pages/Admin/Dashboard";
import Users from "./pages/Admin/Users";
import EventDetails from "./pages/Events/EventDetails";
import Events from "./pages/Admin/Events";
import Chat from "./pages/Chat/Chat";
import Calendar from "./pages/Admin/Calendar";
import MyTickets from "./pages/MyTickets/MyTickets";
import Payments from "./pages/Admin/Payments";
import Tickets from "./pages/Admin/Tickets";
import ProfilePage from "./pages/Profile";
import CategoryEvents from "./pages/Events/CategoryEvents";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/events/category/:categoryName" element={<CategoryEvents />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="admin" element={<AdminLayout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="events" element={<Events />} />
          <Route path="orders" element={<h1>Orders</h1>} />
          <Route path="categories" element={<h1>Categories</h1>} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="payments" element={<Payments />} />
          <Route path="tickets" element={<Tickets />} />
        </Route>

        <Route path="*" element={<h1>Not Found</h1>} />
      </Route>
    </Routes>
  );
};

export default App;