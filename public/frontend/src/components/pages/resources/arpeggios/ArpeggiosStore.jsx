import React, { useRef, useEffect, useState, useContext } from "react";
import { ArpeggiosProvider } from "./ArpeggiosContext";
import { ArpeggiosContext } from "./ArpeggiosContext";

import classes from "./Arpeggios.module.css";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

/// VIOLA SCALES
import { ViolaArpeggio3ctavesNoteModel1 } from "./store/threeOctaveArpeggios/viola/arpeggioModels/ArpeggioModel1";
import { ViolaArpeggio3ctavesNoteModel2 } from "./store/threeOctaveArpeggios/viola/arpeggioModels/ArpeggioModel2";
import { ViolaArpeggio3ctavesNoteModel3 } from "./store/threeOctaveArpeggios/viola/arpeggioModels/ArpeggioModel3";
import { ViolaArpeggio3ctavesNoteModel4 } from "./store/threeOctaveArpeggios/viola/arpeggioModels/ArpeggioModel4";
import { ViolaHalfNoteModel } from "./store/threeOctaveArpeggios/viola/arpeggioModels/HalfNoteModel";
import { ViolaQuarterNoteModel } from "./store/threeOctaveArpeggios/viola/arpeggioModels/QuarterNoteModel";
import { ViolaQuarterNoteTripletModel } from "./store/threeOctaveArpeggios/viola/arpeggioModels/QuarterNoteTripletModel";
import { ViolaEigthNoteModel } from "./store/threeOctaveArpeggios/viola/arpeggioModels/EigthNoteModel";
import { ViolaEigthNoteQuintupletModel } from "./store/threeOctaveArpeggios/viola/arpeggioModels/EigthNoteQuintupletModel";
import { ViolaEigthNoteSextupletModel } from "./store/threeOctaveArpeggios/viola/arpeggioModels/EigthNoteSextupletModel";
import { ViolaEigthNoteSeptupletModel } from "./store/threeOctaveArpeggios/viola/arpeggioModels/EigthNoteSeptupletModel";
import { ViolaSixteenthNoteModel } from "./store/threeOctaveArpeggios/viola/arpeggioModels/SixteenthNoteModel";

/// VIOLIN SCALES
import { HalfNoteModel } from "./store/threeOctaveArpeggios/violin/arpeggioModels/HalfNoteModel";
import { QuarterNoteModel } from "./store/threeOctaveArpeggios/violin/arpeggioModels/QuarterNoteModel";
import { QuarterNoteTripletModel } from "./store/threeOctaveArpeggios/violin/arpeggioModels/QuarterNoteTripletModel";
import { EigthNoteModel } from "./store/threeOctaveArpeggios/violin/arpeggioModels/EigthNoteModel";
import { EigthNoteQuintupletModel } from "./store/threeOctaveArpeggios/violin/arpeggioModels/EigthNoteQuintupletModel";
import { EigthNoteSextupletModel } from "./store/threeOctaveArpeggios/violin/arpeggioModels/EigthNoteSextupletModel";
import { EigthNoteSeptupletModel } from "./store/threeOctaveArpeggios/violin/arpeggioModels/EigthNoteSeptupletModel";
import { SixteenthNoteModel } from "./store/threeOctaveArpeggios/violin/arpeggioModels/SixteenthNoteModel";

export function ArpeggiosStore() {
  const {
    keyName,
    keySignature,
    scaleOctaves,
    setScaleSignatureName,
    setScaleKeyName,
    setIntrument,
    scaleKeyName,
    scaleSignatureName,
    instrumentArpeggios,
    ctxWidth,
    ctxX,
    ctxYIteration,
    ctxHeight,
    scaleX,
    scaleY,
  } = useContext(ArpeggiosContext);
  const [supportsZoom, setSupportsZoom] = useState(true);

  var userAgent = navigator.userAgent;

  useEffect(() => {
    const detectedSafari =
      /^((?!chrome|android|edge|firefox|msie|opera|netscape|trident).)*safari/i.test(
        userAgent
      );
    const detectedFirefox = /firefox/i.test(userAgent);

    if (detectedSafari || detectedFirefox) {
      console.log(detectedSafari), "turn off zoom";
      setSupportsZoom(false);
    }
  }, []);
  console.log(supportsZoom);

  const transition_text = {
    duration: 0.3,
    ease: "easeInOut",
  };
  let scales;
  if (instrumentArpeggios == "viola") {
    scales = (
      <AnimatePresence>
        <motion.div
          className={`${classes.scalesContentContainer} ${
            supportsZoom
              ? classes.scalesContentContainerZoom
              : classes.scalesContentContainerScale
          }`}
          key="resource_scales"
          initial={{
            opacity: 0,
          }}
          animate={{ opacity: 1 }}
          transition={transition_text}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`${classes.scalesContainerOuter} ${
              classes.scalesContainerOuter_1
            } ${
              supportsZoom
                ? classes.scalesContainerOuterZoom
                : classes.scalesContainerOuterScale
            }`}
          >
            <motion.div
              id="myDiv1"
              className={`${classes.scalesContainer} ${
                supportsZoom
                  ? classes.scalesContainerZoom
                  : classes.scalesContainerScale
              }`}
            >
              <motion.div
                className={`${classes.scaleContainer_1} ${
                  supportsZoom
                    ? classes.scaleContainer_1Zoom
                    : classes.scaleContainer_1Scale
                }`}
              >
                <ViolaArpeggio3ctavesNoteModel1 />
              </motion.div>
              <motion.div
                className={`${classes.scaleContainer_1} ${
                  supportsZoom
                    ? classes.scaleContainer_1Zoom
                    : classes.scaleContainer_1Scale
                }`}
              >
                <ViolaArpeggio3ctavesNoteModel2 />
              </motion.div>

              <motion.div
                className={`${classes.scaleContainer_1} ${
                  supportsZoom
                    ? classes.scaleContainer_1Zoom
                    : classes.scaleContainer_1Scale
                }`}
              >
                <ViolaArpeggio3ctavesNoteModel3 />
              </motion.div>
              <motion.div
                className={`${classes.scaleContainer_1} ${
                  supportsZoom
                    ? classes.scaleContainer_1Zoom
                    : classes.scaleContainer_1Scale
                }`}
              >
                <ViolaArpeggio3ctavesNoteModel4 />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  } else {
    scales = (
      <AnimatePresence>
        <motion.div
          className={classes.scalesContentContainer}
          key="resource_scales"
          initial={{
            opacity: 0,
          }}
          animate={{ opacity: 1 }}
          transition={transition_text}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`${classes.scalesContainerOuter} ${classes.scalesContainerOuter_1}`}
          >
            <motion.div id="myDiv1" className={classes.scalesContainer}>
              <motion.div className={classes.scaleContainer_3}>
                <HalfNoteModel />
              </motion.div>
              <motion.div className={classes.scaleContainer_2}>
                <QuarterNoteModel />
              </motion.div>
              <motion.div className={classes.scaleContainer_2}>
                <QuarterNoteTripletModel />
              </motion.div>
              <motion.div className={classes.scaleContainer_2}>
                <EigthNoteModel />
              </motion.div>
              <motion.div className={classes.scaleContainer_2}>
                <EigthNoteQuintupletModel />
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div
            className={`${classes.scalesContainerOuter} ${classes.scalesContainerOuter_2}`}
          >
            <motion.div id="myDiv2" className={classes.scalesContainer}>
              <motion.div className={classes.scaleContainer_2}>
                <EigthNoteSextupletModel />
              </motion.div>
              <motion.div className={classes.scaleContainer_1}>
                <EigthNoteSeptupletModel />
              </motion.div>
              <motion.div className={classes.scaleContainer_2}>
                <SixteenthNoteModel />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <>
      <ArpeggiosContext.Provider
        value={{
          keyName,
          keySignature,
          scaleOctaves,
          setScaleSignatureName,
          setScaleKeyName,
          setIntrument,
          scaleKeyName,
          scaleSignatureName,
          instrumentArpeggios,
          ctxWidth,
          ctxX,
          ctxYIteration,
          ctxHeight,
          scaleX,
          scaleY,
        }}
      >
        {scales}
      </ArpeggiosContext.Provider>
    </>
  );
}
