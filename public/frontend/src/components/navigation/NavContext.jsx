import React, { createContext, useState } from "react";
import Navigation from "./Navigation";

export const NavContext = React.createContext({});

export default function NavProvider() {
  const [showNav, setShowNav] = useState(false);

  return (
    <>
      <NavContext.Provider value={{ showNav, setShowNav }}>
        <Navigation />
      </NavContext.Provider>
    </>
  );
}
