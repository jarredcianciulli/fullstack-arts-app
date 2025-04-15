import React from "react";
import classes from "../Reserve.module.css";
import { Outlet } from "react-router-dom";

import ReserveSectionsNav from "../../../components/tools/reserve/sections/ReserveSectionsNav";

const ReserveSectionsRoot = () => {
  return (
    <div className={classes.mainSectionNav}>
      <ReserveSectionsNav />
      <Outlet />
    </div>
  );
};
export default ReserveSectionsRoot;
