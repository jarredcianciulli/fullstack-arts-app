import React, { useRef, useEffect, useState, useContext } from "react";
import { ArpeggiosProvider } from "./ArpeggiosContext";
import { ArpeggiosOptions } from "./ArpeggiosOptions";
import { ArpeggiosHeader } from "./ArpeggiosHeader";
import { ArpeggiosStore } from "./ArpeggiosStore";

export function ArpeggiosGenerator() {
  return (
    <>
      <ArpeggiosProvider>
        <ArpeggiosHeader />
        <ArpeggiosOptions />
        <ArpeggiosStore />
      </ArpeggiosProvider>
    </>
  );
}
