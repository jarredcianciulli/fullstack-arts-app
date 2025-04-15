import classes from "./Header.module.css";
import HeaderImage from "../navigation/assets/logo-private-lessons.svg";
import HeaderTrialText from "../navigation/assets/home-trial-text.svg";
import HeaderTrialCircle from "../navigation/assets/home-trial-circle.svg";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import ArrrowLeft from "../pages/resources/assets/subscription_arrow_left_icon.svg";

function Header() {
  let [searchParams, setSearchParams] = useSearchParams();
  const url = window.location.href;
  let rightButton =
    url.includes("scales") || url.includes("arpeggios") ? (
      <div className={classes.scalesResourcesBack}>
        <Link to="/resources" className={classes.scalesResourcesLink}>
          <img
            src={ArrrowLeft}
            alt="back arrow icon"
            className={classes.scalesResourcesLinkArrow}
          ></img>
          Resources
        </Link>
      </div>
    ) : null;
  // <div className={classes.headerctaContainer}>
  //   <button className={classes.headerBooking}>Book appointment</button>
  // </div>
  return (
    <div className={classes.headerSection}>
      <div className={classes.headerImgContainer}>
        {/* <Link>
          <img src={HeaderImage} className={classes.headerImg}></img>
        </Link> */}
      </div>
      {rightButton}
    </div>
  );
}

export default Header;
