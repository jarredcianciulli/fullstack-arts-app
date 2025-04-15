import React, { useContext } from "react";

import { ScalesProvider } from "./ScalesContext";

import { ScalesGenerator } from "./ScalesGenerator";

function ScalesPage() {
  return (
    <>
      <ScalesProvider>
        <ScalesGenerator />
      </ScalesProvider>
    </>
  );
}

export default ScalesPage;
