import { useState, useEffect } from "react";
import Icon from "./Icon";
import useAuthStore from "@/store/authStore";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";

const AccountDrawer = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { user, setUser, setToken } = useAuthStore();

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  useEffect(() => {
    const closePopup = (e: any) => {
      if (showPopup && e.target.id !== "icon1" && e.target.id !== "icon2") {
        setShowPopup(false);
      }
    };
    document.addEventListener("click", closePopup);
    return () => document.removeEventListener("click", closePopup);
  }, [showPopup]);

  const handleSignOut = async () => {
    setToken("");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <div className="h-fit  flex cursor-pointer items-center bg-white relative gap-2 border rounded-full py-2 pl-3 pr-2">
      {/* Avatar Image */}
      <FiMenu className="text-lg cursor-pointer" />
      <div className="relative">
        <Icon
          id={"icon"}
          text={user?.name ? user.name : user?.email}
          click={togglePopup}
        />
        {showPopup && (
          <div className="absolute px-2 right-0 top-10 bg-white shadow-md rounded-lg  py-2 mt-4 min-w-[15rem] z-50">
            <Link
              to="/chat"
              className="flex items-center gap-2 px-3 text-sm py-2 rounded-lg hover:bg-gray-200"
            >
              Messages
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-2 px-3 text-sm py-2 rounded-lg hover:bg-gray-200"
            >
              Account
            </Link>

            <div
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-gray-800 text-sm cursor-pointer rounded-lg hover:bg-gray-200"
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDrawer;
