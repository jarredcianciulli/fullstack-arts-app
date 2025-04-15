// import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import MainNavigation from "../navigation/MainNavigation";
import Navigation from "../navigation/Navigation";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import classes from "./Root.module.css";
// import { getTokenDuration } from "../util/auth";

function RootLayout() {
  return (
    <>
      {/* <MainNavigation /> */}
      <Navigation />
      <div className={classes.body}>
        <main>
          {/* <Header /> */}
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default RootLayout;
