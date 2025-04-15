import React, { createContext, useState } from "react";

const ScalesContext = createContext();

const ScalesProvider = ({ children }) => {
  const [scaleKeyName, setScaleKeyName] = useState("C");
  const [scaleSignatureName, setScaleSignatureName] = useState("Major");
  const [scaleOctaves, setScaleOctaves] = useState("3 octaves");
  const [instrumentScale, setInstrument] = useState("viola");
  const [divElement, setDivElement] = useState();

  return (
    <ScalesContext.Provider
      value={{
        value: null,
        keyName: scaleKeyName,
        keySignature: scaleSignatureName,
        keyInfo: null,
        scaleOctaves: scaleOctaves,
        instrument: instrumentScale,
        system: null,
        content: divElement,
        ctxWidth: 1250,
        ctxX: 10,
        ctxYIteration: 150,
        ctxHeight: 150,
        scaleX: 1,
        scaleY: 1,
        scaleKeyName,
        scaleSignatureName,
        instrumentScale,
        scaleKeyName,
        // divElement,
        scaleSignatureName,
        setScaleKeyName,
        setScaleSignatureName,
        setInstrument,
        // setDivElement,
      }}
    >
      {children}
    </ScalesContext.Provider>
  );
};

export { ScalesProvider, ScalesContext };
