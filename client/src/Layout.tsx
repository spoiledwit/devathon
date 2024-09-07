import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import useAuthStore from "./store/authStore";
import useSocketStore from "./store/socketStore";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { loginBack } from "./hooks/auth";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const { user } = useAuthStore();
  const { setSocket, socket } = useSocketStore();
  const { setUser, setToken } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    handleLoginBack();
  }, []);

  const handleLoginBack = async () => {
    try {
      const res = await loginBack();
      if (!res) {
        setToken("");
        setUser(null);
        localStorage.removeItem("token");
        return;
      }
      setUser(res?.user);
      if (res?.token) {
        setToken(res.token);
      }
    } catch (error: any) {
      setToken("");
      setUser(null);
      localStorage.removeItem("token");
      toast.error(error.message);
    }
  };

  useEffect(() => {
    try {
      const socketConnect = io(`${import.meta.env.VITE_BASE_URI}`);
      setSocket(socketConnect);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    console.log("user", user);
    if (user && socket) {
      socket.emit("user_connected", user._id);
    }
  }, [user, socket]);

  return (
    <div className="min-h-screen">
      <Toaster />
      {!location.pathname.includes("admin") && (

<Navbar />
      )}
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
