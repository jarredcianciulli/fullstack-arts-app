import React, { useState, useEffect } from "react";
import classes from "./Login.module.css";
import FormfacadeEmbed from "@formfacade/embed-react";

function IntakeFormPage() {
  return (
    <div className={classes.googleForm}>
      <FormfacadeEmbed
        formFacadeURL="https://formfacade.com/include/100141721575812954020/form/1FAIpQLSccTTj6KjV5Mgpf5abrCTayZsI-YdNWYGV1ncWDdF0QJd_kAg/classic.js/?div=ff-compose"
        onSubmitForm={() => console.log("Form submitted")}
      />
      ;
    </div>
  );
}

export default IntakeFormPage;
