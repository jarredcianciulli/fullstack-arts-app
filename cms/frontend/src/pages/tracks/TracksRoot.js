import React from "react";
import { Outlet } from "react-router-dom";

import classes from "./Tracks.module.css";
import TracksNav from "../../components/tools/tracks/TracksNav.module.css";

const DanceRoot = () => {
  return (
    <div className={classes.main}>
      <TracksNav />
      <Outlet />
    </div>
  );
};

export default DanceRoot;
