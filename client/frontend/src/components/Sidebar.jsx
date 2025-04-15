import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AiFillDashboard, AiOutlineClose } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosOptions } from "react-icons/io";
import { MdOutlineTimeline } from "react-icons/md";
import { FaCartPlus } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa"; // Added user icon
import { motion } from "framer-motion";
import Cookies from "universal-cookie";
import Avatar1 from "./assets/logo_adjacent_white.png";
import "bootstrap/dist/css/bootstrap.min.css";
import classes from "./Sidebar.module.css";
import { useUser } from "../contexts/UserContext";

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [user, setUser] = useState({ name: "Jarred", image: "default.png" }); // Example user with a name and image
  const navigate = useNavigate();
  const cookies = new Cookies();
  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null);

  const showSidebar = () => setSidebar(!sidebar);

  const handleLogout = () => {
    cookies.remove("jwt", { path: "/" });
    navigate("/login");
  };

  const menuItems = [
    { title: "Dashboard", path: "/profile", icon: <AiFillDashboard /> },
    { title: "Enrollments", path: "/enrollments", icon: <MdOutlineTimeline /> },
    { title: "Services", path: "/services", icon: <FaCartPlus /> },
    { title: "Settings", path: "/settings", icon: <IoIosOptions /> },
    { title: "Resources", path: "/resources", icon: <FaRegNewspaper /> },
  ];

  // Close sidebar on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        dropdownVisible
      ) {
        setDropdownVisible(false); // Close dropdown if clicked outside
      }
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        sidebar
      ) {
        setSidebar(false); // Close sidebar if clicked outside
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [sidebar, dropdownVisible]);

  const handleSettingsClick = () => {
    setDropdownVisible(false); // Close dropdown when settings are clicked
  };

  return (
    <>
      <div className={`navbar text-white p-3 ${classes.navbar}`}>
        <div className={classes.navIconContainer}>
          <RxHamburgerMenu
            onClick={showSidebar}
            className={`menu-bars text-white ${classes.menuBars}`}
          />
          <img src={Avatar1} className={classes.logo} alt="Logo" />
        </div>

        {/* User Avatar & Dropdown */}
        <div
          className={`${classes.avatarContainer}`}
          onClick={() => setDropdownVisible(!dropdownVisible)}
        >
          {user.image === "default.png" ? (
            <FaUserCircle className={classes.avatarIcon} />
          ) : (
            <img
              src={user.image}
              alt="User Avatar"
              className={classes.avatarImage}
            />
          )}
        </div>
        {dropdownVisible && (
          <div ref={dropdownRef} className={classes.dropdownMenu}>
            <span>Hi, {user.name}</span>
            <NavLink
              to="/settings"
              className="dropdown-item"
              onClick={handleSettingsClick} // Close dropdown on click
            >
              Go to Settings
            </NavLink>
          </div>
        )}
      </div>

      <motion.nav
        ref={sidebarRef}
        initial={{ x: "-100%" }}
        animate={{ x: sidebar ? "0" : "-100%" }}
        transition={{
          type: "spring",
          stiffness: sidebar ? 1000 : 6000, // Higher stiffness for faster exit
          damping: sidebar ? 10 : 250, // Higher damping for quicker stop
        }}
        className={`nav-menu vh-100 position-fixed top-0 start-0 ${classes.navMenu}`}
      >
        <ul
          className={`nav-menu-items list-unstyled p-3 ${classes.navMenuItems}`}
        >
          <li className="navbar-toggle mb-4">
            <AiOutlineClose
              className={`menu-bars text-white ${classes.navBars}`}
              onClick={showSidebar}
            />
          </li>

          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`nav-text mb-3 ${classes.navText}`}
              onClick={showSidebar} // Close sidebar on link click
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `${
                    isActive ? classes.active : ""
                  } text-white d-flex align-items-center ${classes.textWhite}`
                }
              >
                {item.icon}
                <span className="ms-3">{item.title}</span>
              </NavLink>
            </li>
          ))}
          <li className="mt-auto">
            <button
              className={`btn btn-danger w-100 ${classes.btn}`}
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </motion.nav>
    </>
  );
};

export default Sidebar;
