import React, { useEffect, useState, useContext } from "react";
import { ScalesContext } from "./ScalesContext";

import classes from "./Scales.module.css";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

/// VIOLA SCALES
import { ViolaHalfNoteModel } from "./store/threeOctaveScales/viola/scaleModels/HalfNoteModel";
import { ViolaQuarterNoteModel } from "./store/threeOctaveScales/viola/scaleModels/QuarterNoteModel";
import { ViolaQuarterNoteTripletModel } from "./store/threeOctaveScales/viola/scaleModels/QuarterNoteTripletModel";
import { ViolaEigthNoteModel } from "./store/threeOctaveScales/viola/scaleModels/EigthNoteModel";
import { ViolaEigthNoteQuintupletModel } from "./store/threeOctaveScales/viola/scaleModels/EigthNoteQuintupletModel";
import { ViolaEigthNoteSextupletModel } from "./store/threeOctaveScales/viola/scaleModels/EigthNoteSextupletModel";
import { ViolaEigthNoteSeptupletModel } from "./store/threeOctaveScales/viola/scaleModels/EigthNoteSeptupletModel";
import { ViolaSixteenthNoteModel } from "./store/threeOctaveScales/viola/scaleModels/SixteenthNoteModel";

/// VIOLIN SCALES
import { HalfNoteModel } from "./store/threeOctaveScales/violin/scaleModels/HalfNoteModel";
import { QuarterNoteModel } from "./store/threeOctaveScales/violin/scaleModels/QuarterNoteModel";
import { QuarterNoteTripletModel } from "./store/threeOctaveScales/violin/scaleModels/QuarterNoteTripletModel";
import { EigthNoteModel } from "./store/threeOctaveScales/violin/scaleModels/EigthNoteModel";
import { EigthNoteQuintupletModel } from "./store/threeOctaveScales/violin/scaleModels/EigthNoteQuintupletModel";
import { EigthNoteSextupletModel } from "./store/threeOctaveScales/violin/scaleModels/EigthNoteSextupletModel";
import { EigthNoteSeptupletModel } from "./store/threeOctaveScales/violin/scaleModels/EigthNoteSeptupletModel";
import { SixteenthNoteModel } from "./store/threeOctaveScales/violin/scaleModels/SixteenthNoteModel";

export function ScalesStore() {
  const {
    keyName,
    keySignature,
    scaleOctaves,
    setScaleSignatureName,
    setScaleKeyName,
    setIntrument,
    scaleKeyName,
    scaleSignatureName,
    instrumentScale,
    ctxWidth,
    ctxX,
    ctxYIteration,
    ctxHeight,
    scaleX,
    scaleY,
  } = useContext(ScalesContext);

  const [supportsZoom, setSupportsZoom] = useState(true);

  var userAgent = navigator.userAgent;

  useEffect(() => {
    // const detectedSafari =
    //   /^((?!chrome|android|edge|firefox|msie|opera|netscape|trident).)*safari/i.test(
    //     userAgent
    //   );
    // const detectedFirefox = /firefox/i.test(userAgent);
    // setIsSafari(detectedSafari);
    // setIsFirefox(detectedFirefox);
    // if (detectedSafari || detectedFirefox) {
    //   console.log(detectedSafari), "turn off zoom";
    //   setSupportsZoom(false);
    // }
  }, []);

  const transition_text = {
    duration: 0.3,
    ease: "easeInOut",
  };
  let scales;
  if (instrumentScale == "viola") {
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
                className={`${classes.scaleContainer_3} ${
                  supportsZoom
                    ? classes.scaleContainer_3Zoom
                    : classes.scaleContainer_3Scale
                }`}
              >
                <ViolaHalfNoteModel />
              </motion.div>
              <motion.div
                className={`${classes.scaleContainer_2} ${
                  supportsZoom
                    ? classes.scaleContainer_2Zoom
                    : classes.scaleContainer_2Scale
                }`}
              >
                <ViolaQuarterNoteModel />
              </motion.div>
              <motion.div
                className={`${classes.scaleContainer_2} ${
                  supportsZoom
                    ? classes.scaleContainer_2Zoom
                    : classes.scaleContainer_2Scale
                }`}
              >
                <ViolaQuarterNoteTripletModel />
              </motion.div>
              <motion.div
                className={`${classes.scaleContainer_2} ${
                  supportsZoom
                    ? classes.scaleContainer_2Zoom
                    : classes.scaleContainer_2Scale
                }`}
              >
                <ViolaEigthNoteModel />
              </motion.div>
              <motion.div
                className={`${classes.scaleContainer_2} ${
                  supportsZoom
                    ? classes.scaleContainer_2Zoom
                    : classes.scaleContainer_2Scale
                }`}
              >
                <ViolaEigthNoteQuintupletModel />
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div
            className={`${classes.scalesContainerOuter} ${classes.scalesContainerOuter_2}`}
          >
            <motion.div id="myDiv2" className={classes.scalesContainer}>
              <motion.div
                className={`${classes.scaleContainer_2} ${
                  supportsZoom
                    ? classes.scaleContainer_2Zoom
                    : classes.scaleContainer_2Scale
                }`}
              >
                <ViolaEigthNoteSextupletModel />
              </motion.div>
              <motion.div
                className={`${classes.scaleContainer_1} ${
                  supportsZoom
                    ? classes.scaleContainer_1Zoom
                    : classes.scaleContainer_1Scale
                }`}
              >
                <ViolaEigthNoteSeptupletModel />
              </motion.div>
              <motion.div
                className={`${classes.scaleContainer_2} ${
                  supportsZoom
                    ? classes.scaleContainer_2Zoom
                    : classes.scaleContainer_2Scale
                }`}
              >
                <ViolaSixteenthNoteModel />
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
              className={`${classes.scalesContainer}
              } ${
                supportsZoom
                  ? classes.scalesContainerZoom
                  : classes.scalesContainerScale
              }`}
            >
              <motion.div
                className={`${classes.scaleContainer_3} ${
                  supportsZoom
                    ? classes.scaleContainer_3Zoom
                    : classes.scaleContainer_3Scale
                }`}
              >
                <HalfNoteModel />
              </motion.div>
              <motion.div
                className={`${classes.scaleContainer_2} ${
                  supportsZoom
                    ? classes.scaleContainer_2Zoom
                    : classes.scaleContainer_2Scale
                }`}
              >
                <QuarterNoteModel />
              </motion.div>
              <motion.div
                className={`${classes.scaleContainer_2} ${
                  supportsZoom
                    ? classes.scaleContainer_2Zoom
                    : classes.scaleContainer_2Scale
                }`}
              >
                <QuarterNoteTripletModel />
              </motion.div>
              <motion.div
                className={`${classes.scaleContainer_2} ${
                  supportsZoom
                    ? classes.scaleContainer_2Zoom
                    : classes.scaleContainer_2Scale
                }`}
              >
                <EigthNoteModel />
              </motion.div>
              <motion.div
                className={`${classes.scaleContainer_2} ${
                  supportsZoom
                    ? classes.scaleContainer_2Zoom
                    : classes.scaleContainer_2Scale
                }`}
              >
                <EigthNoteQuintupletModel />
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div
            className={`${classes.scalesContainerOuter} ${classes.scalesContainerOuter_2}`}
          >
            <motion.div id="myDiv2" className={classes.scalesContainer}>
              <motion.div
                className={`${classes.scaleContainer_2} ${
                  supportsZoom
                    ? classes.scaleContainer_2Zoom
                    : classes.scaleContainer_2Scale
                }`}
              >
                <EigthNoteSextupletModel />
              </motion.div>
              <motion.div
                className={`${classes.scaleContainer_1} ${
                  supportsZoom
                    ? classes.scaleContainer_1Zoom
                    : classes.scaleContainer_1Scale
                }`}
              >
                <EigthNoteSeptupletModel />
              </motion.div>
              <motion.div
                className={`${classes.scaleContainer_2} ${
                  supportsZoom
                    ? classes.scaleContainer_2Zoom
                    : classes.scaleContainer_2Scale
                }`}
              >
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
      <ScalesContext.Provider
        value={{
          keyName,
          keySignature,
          scaleOctaves,
          setScaleSignatureName,
          setScaleKeyName,
          setIntrument,
          scaleKeyName,
          scaleSignatureName,
          instrumentScale,
          ctxWidth,
          ctxX,
          ctxYIteration,
          ctxHeight,
          scaleX,
          scaleY,
        }}
      >
        {scales}
      </ScalesContext.Provider>
    </>
  );
}
