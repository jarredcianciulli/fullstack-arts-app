import React, { useRef, useEffect, useState, useContext } from "react";
import { ScalesProvider } from "./ScalesContext";
import { ScalesOptions } from "./ScalesOptions";
import { ScalesHeader } from "./ScalesHeader";
import { ScalesStore } from "./ScalesStore";

import classes from "./Scales.module.css";

// /// VIOLA SCALES
// import { ViolaHalfNoteModel } from "./store/threeOctaveScales/viola/scaleModels/HalfNoteModel";
// import { ViolaQuarterNoteModel } from "./store/threeOctaveScales/viola/scaleModels/QuarterNoteModel";
// import { ViolaQuarterNoteTripletModel } from "./store/threeOctaveScales/viola/scaleModels/QuarterNoteTripletModel";
// import { ViolaEigthNoteModel } from "./store/threeOctaveScales/viola/scaleModels/EigthNoteModel";
// import { ViolaEigthNoteQuintupletModel } from "./store/threeOctaveScales/viola/scaleModels/EigthNoteQuintupletModel";
// import { ViolaEigthNoteSextupletModel } from "./store/threeOctaveScales/viola/scaleModels/EigthNoteSextupletModel";
// import { ViolaEigthNoteSeptupletModel } from "./store/threeOctaveScales/viola/scaleModels/EigthNoteSeptupletModel";
// import { ViolaSixteenthNoteModel } from "./store/threeOctaveScales/viola/scaleModels/SixteenthNoteModel";

// /// VIOLIN SCALES
// import { HalfNoteModel } from "./store/threeOctaveScales/violin/scaleModels/HalfNoteModel";
// import { QuarterNoteModel } from "./store/threeOctaveScales/violin/scaleModels/QuarterNoteModel";
// import { QuarterNoteTripletModel } from "./store/threeOctaveScales/violin/scaleModels/QuarterNoteTripletModel";
// import { EigthNoteModel } from "./store/threeOctaveScales/violin/scaleModels/EigthNoteModel";
// import { EigthNoteQuintupletModel } from "./store/threeOctaveScales/violin/scaleModels/EigthNoteQuintupletModel";
// import { EigthNoteSextupletModel } from "./store/threeOctaveScales/violin/scaleModels/EigthNoteSextupletModel";
// import { EigthNoteSeptupletModel } from "./store/threeOctaveScales/violin/scaleModels/EigthNoteSeptupletModel";
// import { SixteenthNoteModel } from "./store/threeOctaveScales/violin/scaleModels/SixteenthNoteModel";

export function ScalesGenerator() {
  return (
    <>
      <ScalesProvider>
        <ScalesHeader />
        <ScalesOptions />
        <ScalesStore />
      </ScalesProvider>
    </>
  );
}
