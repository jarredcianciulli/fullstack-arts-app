import React, { createContext, useState } from "react";

const ArpeggiosContext = createContext();

const ArpeggiosProvider = ({ children }) => {
  const [
    // setDivElement,
    arpeggiosKeyName,
    setArpeggiosKeyName,
  ] = useState("C");
  const [ArpeggiosSignatureName, setArpeggiosSignatureName] = useState("Major");
  const [ArpeggiosOctaves, setArpeggiosOctaves] = useState("3 octaves");
  const [instrumentArpeggios, setInstrument] = useState("viola");
  const [divElement, setDivElement] = useState();

  return (
    <ArpeggiosContext.Provider
      value={{
        value: null,
        keyName: arpeggiosKeyName,
        keySignature: ArpeggiosSignatureName,
        keyInfo: null,
        ArpeggiosOctaves: ArpeggiosOctaves,
        instrument: instrumentArpeggios,
        system: null,
        content: divElement,
        ctxWidth: 1250,
        ctxX: 10,
        ctxYIteration: 150,
        ctxHeight: 150,
        scaleX: 1,
        scaleY: 1,
        ArpeggiosSignatureName,
        instrumentArpeggios,
        arpeggiosKeyName,
        ArpeggiosSignatureName,
        setArpeggiosKeyName,
        setArpeggiosSignatureName,
        setInstrument,
      }}
    >
      {children}
    </ArpeggiosContext.Provider>
  );
};

export { ArpeggiosProvider, ArpeggiosContext };
