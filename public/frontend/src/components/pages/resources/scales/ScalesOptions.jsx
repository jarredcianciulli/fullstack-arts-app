import React, { useContext, useEffect, useRef, useState } from "react";
import { ScalesContext } from "./ScalesContext";
import { useSearchParams } from "react-router-dom";
import classes from "./Scales.module.css";

import { motion, AnimatePresence } from "framer-motion";

export function ScalesOptions(props) {
  const {
    keyName,
    keySignature,
    scaleOctaves,
    setScaleSignatureName,
    setScaleKeyName,
    setInstrument,
    scaleKeyName,
    scaleSignatureName,
    instrumentScale,
  } = useContext(ScalesContext);

  const music = useRef(null);
  const scaleKeyNameRef = useRef(null);
  const scaleInstrument = useRef(null);
  const scaleKeySignatureRef = useRef(null);
  const scaleKeyRef = useRef(null);
  const selectScaleNameRef = useRef(null);
  const selectScaleKeyRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("keySignature")) {
      scaleKeyNameRef.current = searchParams.get("keyName");

      scaleKeySignatureRef.current = searchParams.get("keySignature");
      scaleInstrument.current = searchParams.get("instrument");
      scaleKeyRef.current =
        searchParams.get("keyName") + " " + searchParams.get("keySignature");
      setScaleKeyName(searchParams.get("keyName"));
      setScaleSignatureName(searchParams.get("keySignature"));
      setInstrument(searchParams.get("instrument"));
    }
  }, [keyName, scaleInstrument]);

  function handleKeyNameChange(e) {
    const value = e.target.value;
    scaleKeyNameRef.current = value;
    setScaleKeyName(value);
    setSearchParams({
      keyName: scaleKeyNameRef.current,
      keySignature: scaleKeySignatureRef.current,
      instrument: scaleInstrument.current,
    });
    scaleKeyRef.current =
      scaleKeyNameRef.current + " " + scaleKeySignatureRef.current;
  }

  function handleKeySignatureChange(e) {
    const value = e.target.value;
    scaleKeySignatureRef.current = value;
    setScaleSignatureName(value);
    setSearchParams({
      keyName: scaleKeyNameRef.current,
      keySignature: scaleKeySignatureRef.current,
      instrument: scaleInstrument.current,
    });
    scaleKeyRef.current =
      scaleKeyNameRef.current + " " + scaleKeySignatureRef.current;
  }

  function handleScaleOctaveChange() {}
  function handleInstrumentChange(e) {
    const value = e.target.value;
    scaleInstrument.current = value;
    setInstrument(value);
    setSearchParams({
      keyName: scaleKeyNameRef.current,
      keySignature: scaleKeySignatureRef.current,
      instrument: scaleInstrument.current,
    });
  }

  function selectScaleName(e) {
    if (selectScaleNameRef.current) {
      selectScaleNameRef.current.click();
    }
  }
  function selectScaleKey() {
    if (selectScaleKeyRef.current) {
      selectScaleKeyRef.current.focus();
    }
  }
  const transition_text = {
    duration: 0.3,
    ease: "easeInOut",
  };
  return (
    <AnimatePresence>
      <ScalesContext.Provider
        value={{
          keyName: scaleKeyName,
          keySignature: scaleSignatureName,
          instrumentScale: instrumentScale,
        }}
      >
        <motion.div
          className={classes.scalesMainContainer}
          key="resource_scale_header"
          initial={{
            opacity: 0,
          }}
          animate={{ opacity: 1 }}
          transition={transition_text}
          exit={{ opacity: 0 }}
        >
          <motion.div className={classes.scalesLinkFilterContainer}>
            <motion.div
              className={`${classes.scalesLinkFilterItemContainer} ${classes.scalesLinkFilterfirst}`}
            >
              <motion.select
                className={classes.scaleKeyName}
                onChange={handleKeyNameChange}
                defaultValue={keyName}
              >
                <motion.option value="All" selected={keyName == "All"}>
                  All
                </motion.option>
                <motion.option value="G" selected={keyName == "G"}>
                  G
                </motion.option>
                <motion.option value="Ab" selected={keyName == "Ab"}>
                  Ab
                </motion.option>
                <motion.option value="A" selected={keyName == "A"}>
                  A
                </motion.option>
                <motion.option value="Bb" selected={keyName == "Bb"}>
                  Bb
                </motion.option>
                <motion.option value="B" selected={keyName == "B"}>
                  B
                </motion.option>
                <motion.option value="C" selected={keyName == "C"}>
                  C
                </motion.option>
                <motion.option value="C#" selected={keyName == "C#"}>
                  C#
                </motion.option>
                <motion.option value="D" selected={keyName == "D"}>
                  D
                </motion.option>
                <motion.option value="Eb" selected={keyName == "Eb"}>
                  Eb
                </motion.option>
                <motion.option value="E" selected={keyName == "E"}>
                  E
                </motion.option>
                <motion.option value="F" selected={keyName == "F"}>
                  F
                </motion.option>
                <motion.option value="F#" selected={keyName == "F#"}>
                  F#
                </motion.option>
              </motion.select>
              {/* <img
              className={classes.arrowDownImg}
              src={ArrrowDown}
              onClick={selectScaleName}
              ref={buttonRef}
            ></img> */}
            </motion.div>
            <motion.div className={classes.scalesLinkFilterItemContainer}>
              <motion.select
                id="key_signature"
                className={classes.scaleKeySignature}
                onChange={handleKeySignatureChange}
                defaultValue={keySignature}
                ref={selectScaleKeyRef}
              >
                <motion.option value="Major" selected={keySignature == "Major"}>
                  Major
                </motion.option>
                <motion.option
                  value="Natural Minor"
                  selected={keySignature == "Natural Minor"}
                >
                  Natural Minor
                </motion.option>
                <motion.option
                  value="Melodic Minor"
                  selected={keySignature == "Melodic Minor"}
                >
                  Melodic Minor
                </motion.option>
                <motion.option
                  value="Harmonic Minor"
                  selected={keySignature == "Harmonic Minor"}
                >
                  Harmonic Minor
                </motion.option>
              </motion.select>
              {/* <img
              className={classes.arrowDownImg}
              src={ArrrowDown}
              onClick={selectScaleKey}
            ></img> */}
            </motion.div>
            {/* <motion.div className={classes.scalesLinkFilterItemBreak}>|</div> */}
            <motion.div className={classes.scalesLinkFilterItemContainer}>
              <motion.select
                id="key_octaves"
                className={classes.scaleOctaves}
                onChange={handleScaleOctaveChange}
                defaultValue={scaleOctaves}
              >
                {/* <motion.option value="1 octave" selected={scaleOctaves == "1 octave"}>
                1 octave
              </motion.option>
              <motion.option value="2 octaves" selected={scaleOctaves == "2 octaves"}>
                2 octaves
              </motion.option> */}
                <motion.option
                  value="3 octaves"
                  selected={scaleOctaves == "3 octaves"}
                >
                  3 octaves
                </motion.option>
                {/* <motion.option
                value="4 octaves"
                selected={scaleSignatureName == "4 octaves"}
              >
                4 octaves
              </motion.option> */}
              </motion.select>
              {/* <img
              className={classes.arrowDownImg}
              src={ArrrowDown}
              onClick={selectScaleKey}
            ></img> */}
            </motion.div>
            <motion.div className={classes.scalesLinkFilterItemContainer}>
              <motion.select
                id="instrument"
                className={classes.instrument}
                onChange={handleInstrumentChange}
                defaultValue={instrumentScale}
                ref={scaleInstrument}
              >
                <motion.option
                  value="violin"
                  selected={instrumentScale == "violin"}
                >
                  Violin
                </motion.option>
                <motion.option
                  value="viola"
                  selected={instrumentScale == "viola"}
                >
                  Viola
                </motion.option>
              </motion.select>
            </motion.div>
          </motion.div>
          <motion.div className={classes.scalesMainLineBreak}></motion.div>
        </motion.div>
      </ScalesContext.Provider>
    </AnimatePresence>
  );
}
