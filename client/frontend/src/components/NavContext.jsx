import React, { createContext, useState } from "react";
import MainNavigation from "./MainNavigation";

export const NavContext = React.createContext({});

export default function NavProvider() {
  const [showNav, setShowNav] = useState(false);

  return (
    <>
      <NavContext.Provider value={{ showNav, setShowNav }}>
        <MainNavigation />
      </NavContext.Provider>
    </>
  );
}
