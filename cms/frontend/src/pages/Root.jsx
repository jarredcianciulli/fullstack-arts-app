import { Outlet } from "react-router-dom";

import MainNavigation from "../components/navigation/MainNavigation";
// import Footer from "../components/footer/Footer";
import classes from "./Root.module.css";

function RootLayout() {
  return (
    <div class="rootpage">
      <div className={classes.body}>
        <MainNavigation />
        <main>
          <Outlet />
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  );
}

export default RootLayout;
