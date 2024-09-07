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
    // <header className={`bg-violet-950 z-50 ${pathname.includes("admin") ? " hidden" : ""}`}>
    //   <nav className={`${styles.navbar} ${styles.container}`}>
    //     <Link to={"/"} className={`${styles.nav_link} text-xl text-white whitespace-nowrap lg:ml-10 font-bold`}>
    //      Devathon
    //     </Link>
    //     <ul className={`${styles.nav_list}`}>
    //         {navLinks.map((link, index) => {
    //           const isActive = location.pathname === link.slug;
    //           return (
    //             <Link to={link.slug} key={index} 
    //                 className={`${styles.nav_item}`}
    //                 onMouseEnter={() => setBarPosition(index * 7)} 
    //                 onMouseLeave={() => setBarPosition(navLinks.findIndex(link => location.pathname === link.slug) * 7)}
    //             >
    //               <p className={`${styles.nav_link} ${isActive ? styles.current_active : ""}`}>
    //                 {link.title}
    //               </p>
    //             </Link>
    //           )
    //         })}
    //         {isCurrentRouteInNavLinks && (
    //           <div className={`${styles.active}`} style={{transform: `translateX(${barPosition}rem)`}}></div>
    //         )}
    //       <span className='ml-20 mr-10'>
    //         <LoadingButton 
    //         text={user ? 'Logout' : 'Login'}
    //         isLoading={false}
    //         onClick={handleClick}
    //         type='button'
    //         />
    //       </span>
    //     </ul>
    //     <div className={`${styles.hb} flex-1 justify-end items-center`}>
    //     {toggle ? <AiOutlineClose className="w-[28px] text-white cursor-pointer h-[28px] object-contain" onClick={() => setToggle(!toggle)} /> : <RiMenu3Fill className="w-[28px] text-white cursor-pointer h-[28px] object-contain" onClick={() => setToggle(!toggle)} />}
    //     <div
    //       className={`${
    //         !toggle ? "hidden" : "flex"
    //       } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
    //     >
    //       <ul className={`list-none z-50 flex justify-end items-start flex-1 flex-col bg-fuchsia-900 p-10 rounded-3xl`}>
    //         {navLinks.map((nav, index) => (
    //           <Link
    //             to={nav.slug}
    //             onClick={() => setToggle(!toggle)}
    //             key={nav.id}
    //             className={`font-poppins font-medium cursor-pointer text-white text-[16px] 
    //              ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
    //           >
    //             <p>{nav.title}</p>
    //           </Link>
    //         ))}
    //       </ul>
    //     </div>
    //   </div>
    //   </nav>
    // </header>
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