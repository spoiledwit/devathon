import { useEffect, useState } from 'react';
import { navLinks } from "../../constants";
import { Link, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { logout } from "../../hooks/auth";
import useSocketStore from '../../store/socketStore';
import SearchBar from '../Home/SearchBar/SearchBar';
import Menu from '../Home/Menu/Menu';
import Notification from '../notifications';
import { CgGlobeAlt } from 'react-icons/cg';
import AccountDrawer from './AccountDrawer/AccountDrawer';


const Navbar = () => {
  const location = useLocation();
  const { user, setToken, setUser } = useAuthStore();
  const { socket } = useSocketStore();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");

  const currentIndex = navLinks.findIndex(link => location.pathname === link.slug);
  const [barPosition, setBarPosition] = useState(currentIndex !== -1 ? currentIndex * 7 : 0);

  const router = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);


  useEffect(() => {
    setBarPosition(currentIndex !== -1 ? currentIndex * 7 : 0);
  }, [location.pathname]);

  const handleClick = async () => {
    if (user) {
      logout();
      socket.emit("removeUser", user.email);
      setUser(null);
      setToken(null);
    }
    else {
      navigate('/login');
    }
  };

  return (
    
    <div>
      <div className="bg-white pt-2 flex flex-col ">
        <header className="flex sm:pb-0 pb-3 px-10 md:px-20 justify-between items-center gap-3  ">
          <Link to={"/"} className="flex gap-1 md:mb-2 sm:mb-0">
            <span className="font-semibold block mt-auto text-xl">
              <p>Devathon</p>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (language === "urdu") {
                  setLanguage("en");
                } else {
                  setLanguage("urdu");
                }
              }}
            >
              <CgGlobeAlt size={25} className="text-gray-600 font-medium" />
            </button>
            <Notification />
            {user ? (
              <div className="flex">
                <AccountDrawer />
              </div>
            ) : (
              <div
                onClick={() => router("/login")}
                className="md:flex hidden items-center gap-2 border border-gray-300 rounded-full py-2 my-2.5 px-4 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
                <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 relative top-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </header>

        {location.pathname === "/" && !isMobile && <SearchBar />}

        <hr />
        <div className="md:block hidden md:px-20">
          <Menu />
        </div>
      </div>
    </div>
  )
}

export default Navbar;