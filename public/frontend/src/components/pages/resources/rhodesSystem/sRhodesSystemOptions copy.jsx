import React, { useContext } from "react";

import { sRhodesSystemProvider } from "./sRhodesSystemContext";

import { sRhodesSystemGenerator } from "./sRhodesSystemGenerator";

function sRhodesSystemPage() {
  return (
    <>
      <sRhodesSystemProvider>
        <sRhodesSystemGenerator />
      </sRhodesSystemProvider>
    </>
  );
}

export default sRhodesSystemPage;
