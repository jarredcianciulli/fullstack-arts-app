import { NavLink } from "react-router-dom";

import classes from "./Footer.module.css";
import Avatar1 from "./assets/logo_icon.png";

function Footer() {
  return (
    <div className={classes.container}>
      <div className={classes.navigation}>
        <ul className={classes.navigationContainer}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Home
            </NavLink>
          </li>
          {/* <li
            to="/yoga"
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
          >
            Yoga
          </li> */}
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              About
            </NavLink>
          </li>
          {/* <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              About
            </NavLink>
          </li> */}
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Contact
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/privacy-policy"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Privacy Policy
            </NavLink>
          </li>
        </ul>
        <div className={classes.logoContainer}>
          <img className={classes.logo} src={Avatar1} />
        </div>
        <div className={classes.copyrightContainer}>
          <p className={classes.copyrightText}>
            Founded by Joseph Meehan. &copy; 2024
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
