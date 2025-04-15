import React from "react";
import classes from "../Reserve.module.css";
import ReserveOverview from "../../../components/tools/reserve/ReserveOverview";

const ReserveSections = () => {
  return (
    <div className={classes.main}>
      <ReserveOverview />
    </div>
  );
};
export default ReserveSections;
