import React, { useRef } from "react";
import classes from "./ErrorBlock.module.css";

export default function ErrorBlock({ title, message }) {
  let errorContent;
  const errorMessageRef = useRef(null);
  // errorContent = (
  //   <div className={classes.errorBlock} ref={errorMessageRef}>
  //     <div className={classes.errorBlockIcon}>!</div>
  //     <div className={classes.errorBlockText}>
  //       <h2>{title}</h2>
  //       <p>{message}</p>
  //     </div>
  //   </div>
  // );

  setTimeout(() => {
    hideErrorMessage();
  }, 5000);

  const hideErrorMessage = () => {
    errorMessageRef.current.innerHTML = "";
  };

  return (
    <div ref={errorMessageRef}>
      (
      <div className={classes.errorBlock}>
        <div className={classes.errorBlockIcon}>!</div>
        <div className={classes.errorBlockText}>
          <h2>{title}</h2>
          <p>{message}</p>
        </div>
      </div>
      );
    </div>
  );
}
