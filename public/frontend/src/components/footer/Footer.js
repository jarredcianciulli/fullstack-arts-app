import classes from "./Footer.module.css";
import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <div
      className={`${classes.footerContainer} ${
        isHome ? classes.homeBodyActive : ""
      }`}
    >
      <div className={classes.footer}>Jarred Cianciulli &copy; 2023</div>
    </div>
  );
}

export default Footer;
