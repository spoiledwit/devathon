import { useEffect, useState} from 'react';
import { navLinks } from "../../constants";
import LoadingButton from '../Buttons/LoadingButton';
import styles from "../../styles/navbar.module.css"
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { RiMenu3Fill } from 'react-icons/ri';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import {logout} from "../../hooks/auth";
import useSocketStore from '../../store/socketStore';


const Navbar = () => {
  const location = useLocation();
  const [toggle, setToggle] = useState(false);
  const {user, setToken, setUser} = useAuthStore();
  const {socket} = useSocketStore();
  const navigate = useNavigate();

  const currentIndex = navLinks.findIndex(link => location.pathname === link.slug);
  const [barPosition, setBarPosition] = useState(currentIndex !== -1 ? currentIndex * 7 : 0);
  const isCurrentRouteInNavLinks = currentIndex !== -1;

  const pathname = location.pathname;

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
    <header className={`bg-violet-950 z-50 ${pathname.includes("admin") ? " hidden" : ""}`}>
      <nav className={`${styles.navbar} ${styles.container}`}>
        <Link to={"/"} className={`${styles.nav_link} text-xl text-white whitespace-nowrap lg:ml-10 font-bold`}>
         Devathon
        </Link>
        <ul className={`${styles.nav_list}`}>
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.slug;
              return (
                <Link to={link.slug} key={index} 
                    className={`${styles.nav_item}`}
                    onMouseEnter={() => setBarPosition(index * 7)} 
                    onMouseLeave={() => setBarPosition(navLinks.findIndex(link => location.pathname === link.slug) * 7)}
                >
                  <p className={`${styles.nav_link} ${isActive ? styles.current_active : ""}`}>
                    {link.title}
                  </p>
                </Link>
              )
            })}
            {isCurrentRouteInNavLinks && (
              <div className={`${styles.active}`} style={{transform: `translateX(${barPosition}rem)`}}></div>
            )}
          <span className='ml-20 mr-10'>
            <LoadingButton 
            text={user ? 'Logout' : 'Login'}
            isLoading={false}
            onClick={handleClick}
            type='button'
            />
          </span>
        </ul>
        <div className={`${styles.hb} flex-1 justify-end items-center`}>
        {toggle ? <AiOutlineClose className="w-[28px] text-white cursor-pointer h-[28px] object-contain" onClick={() => setToggle(!toggle)} /> : <RiMenu3Fill className="w-[28px] text-white cursor-pointer h-[28px] object-contain" onClick={() => setToggle(!toggle)} />}
        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className={`list-none z-50 flex justify-end items-start flex-1 flex-col bg-fuchsia-900 p-10 rounded-3xl`}>
            {navLinks.map((nav, index) => (
              <Link
                to={nav.slug}
                onClick={() => setToggle(!toggle)}
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-white text-[16px] 
                 ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
              >
                <p>{nav.title}</p>
              </Link>
            ))}
          </ul>
        </div>
      </div>
      </nav>
    </header>
  )
}

export default Navbar;