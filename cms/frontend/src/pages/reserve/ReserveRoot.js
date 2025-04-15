import React from "react";
import classes from "./Reserve.module.css";
import { Outlet } from "react-router-dom";

import ReserveNav from "../../components/tools/reserve/ReserveNav";

const ReserveRoot = () => {
  console.log("hoho");
  return (
    <div className={classes.mainSectionNav}>
      <ReserveNav />
      <Outlet />
    </div>
  );
};
export default ReserveRoot;
