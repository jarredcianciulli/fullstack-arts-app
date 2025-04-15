import { useEffect } from "react";
import { Outlet, useLoaderData, useSubmit } from "react-router-dom";

import MainNavigation from "../components/MainNavigation";
import Sidebar from "../components/Sidebar";
// import NavProvider from "../components/NavContext";
import Footer from "../components/Footer";
import classes from "./Root.module.css";
import ScrollToTop from "../components/ScrollToTop";
// import { getTokenDuration } from "../util/auth";

function RootLayout() {
  //   const token = useLoaderData();
  //   const submit = useSubmit();
  //   useEffect(() => {
  //     if (!token) {
  //       return;
  //     }
  //     if (token === "EXPIRED") {
  //       submit(null, { action: "/logout", method: "post" });
  //       return;
  //     }
  //     const tokenDuration = getTokenDuration();
  //     console.log(tokenDuration);
  //     setTimeout(() => {
  //       submit(null, { action: "/logout", method: "post" });
  //     }, tokenDuration);
  //   }, [token, submit]);

  return (
    <>
      {/* <MainNavigation /> */}
      <Sidebar />
      <ScrollToTop />
      {/* <NavProvider /> */}

      <div className={classes.body}>
        <main>
          {/* {navigation.state === "loading" && <p>Loading...</p>} */}
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}

export default RootLayout;
