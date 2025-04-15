import React from "react";
import classes from "./Reserve.module.css";
import ReserveCreate from "../../components/tools/reserve/ReserveCreate";

const ReserveCreateSection = () => {
  return (
    <div className={classes.main}>
      <ReserveCreate />
    </div>
  );
};
export default ReserveCreateSection;
