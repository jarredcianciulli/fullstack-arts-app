import React, { useRef } from "react";
import classes from "./SuccessBlock.module.css";

export default function SuccessBlock({ title, message }) {
  const successMessageRef = useRef(null);
  // errorContent = (
  //   <div className={classes.errorBlock} ref={errorMessageRef}>
  //     <div className={classes.errorBlockIcon}>!</div>
  //     <div className={classes.errorBlockText}>
  //       <h2>{title}</h2>
  //       <p>{message}</p>
  //     </div>
  //   </div>
  // );

  //   setTimeout(() => {
  // hideErrorMessage();
  //   }, 5000);

  //   const hideErrorMessage = () => {
  //     successMessageRef.current.innerHTML = "";
  //   };

  return (
    <div ref={successMessageRef}>
      (
      <div className={classes.successBlock}>
        <div className={classes.successBlockIcon}>&#10004;</div>
        <div className={classes.successBlockText}>
          <h2>{title}</h2>
          <p>{message}</p>
        </div>
      </div>
      );
    </div>
  );
}
