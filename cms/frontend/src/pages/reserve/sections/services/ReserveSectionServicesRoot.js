import React from "react";
import classes from "../../Reserve.module.css";
import { Outlet } from "react-router-dom";

import ReserveSectionServicesNav from "../../../../components/tools/reserve/sections/services/ReserveSectionServicesNav";

const ReserveSectionsServicesRoot = () => {
  console.log("hoho");
  return (
    <div className={classes.mainSectionNav}>
      <ReserveSectionServicesNav />
      <Outlet />
    </div>
  );
};
export default ReserveSectionsServicesRoot;
