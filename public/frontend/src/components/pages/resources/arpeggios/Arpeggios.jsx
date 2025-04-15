import React, { useContext } from "react";

import { ArpeggiosProvider } from "./ArpeggiosContext";

import { ArpeggiosGenerator } from "./ArpeggiosGenerator";

function ArpeggiosPage() {
  return (
    <>
      <ArpeggiosProvider>
        <ArpeggiosGenerator />
      </ArpeggiosProvider>
    </>
  );
}

export default ArpeggiosPage;
