import React, { useContext, useEffect, useRef, useState } from "react";
import { ArpeggiosContext } from "./ArpeggiosContext";
import { useSearchParams } from "react-router-dom";
import classes from "./Arpeggios.module.css";

import { motion, AnimatePresence } from "framer-motion";

export function ArpeggiosOptions(props) {
  const {
    keyName,
    keySignature,
    ArpeggiosOctaves,
    setArpeggiosSignatureName,
    setArpeggiosKeyName,
    setInstrument,
    ArpeggiosKeyName,
    ArpeggiosSignatureName,
    instrumentArpeggios,
  } = useContext(ArpeggiosContext);

  const music = useRef(null);
  const arpeggiosKeyNameRef = useRef(null);
  const arpeggiosInstrument = useRef(null);
  const arpeggiosKeySignatureRef = useRef(null);
  const arpeggiosKeyRef = useRef(null);
  const selectArpeggioNameRef = useRef(null);
  const selectArpeggioKeyRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("keySignature")) {
      arpeggiosKeyNameRef.current = searchParams.get("keyName");

      arpeggiosKeySignatureRef.current = searchParams.get("keySignature");
      arpeggiosInstrument.current = searchParams.get("instrument");
      arpeggiosKeyRef.current =
        searchParams.get("keyName") + " " + searchParams.get("keySignature");
      setArpeggiosKeyName(searchParams.get("keyName"));
      setArpeggiosSignatureName(searchParams.get("keySignature"));
      setInstrument(searchParams.get("instrument"));
    }
  }, [keyName, arpeggiosInstrument]);

  function handleKeyNameChange(e) {
    const value = e.target.value;
    arpeggiosKeyNameRef.current = value;
    setArpeggiosKeyName(value);
    setSearchParams({
      keyName: arpeggiosKeyNameRef.current,
      keySignature: arpeggiosKeySignatureRef.current,
      instrument: arpeggiosInstrument.current,
    });
    arpeggiosKeyRef.current =
      arpeggiosKeyNameRef.current + " " + arpeggiosKeySignatureRef.current;
  }

  function handleKeySignatureChange(e) {
    const value = e.target.value;
    arpeggiosKeySignatureRef.current = value;
    setArpeggiosSignatureName(value);
    setSearchParams({
      keyName: arpeggiosKeyNameRef.current,
      keySignature: arpeggiosKeySignatureRef.current,
      instrument: arpeggiosInstrument.current,
    });
    arpeggiosKeyRef.current =
      arpeggiosKeyNameRef.current + " " + arpeggiosKeySignatureRef.current;
  }

  function handleInstrumentChange(e) {
    const value = e.target.value;
    arpeggiosInstrument.current = value;
    setInstrument(value);
    setSearchParams({
      keyName: arpeggiosKeyNameRef.current,
      keySignature: arpeggiosKeySignatureRef.current,
      instrument: arpeggiosInstrument.current,
    });
  }

  function selectArpeggiosName(e) {
    if (selectArpeggioNameRef.current) {
      selectArpeggioNameRef.current.click();
    }
  }
  function selectArpeggioseKey() {
    if (selectArpeggiosKeyRef.current) {
      selectArpeggiosKeyRef.current.focus();
    }
  }
  const transition_text = {
    duration: 0.3,
    ease: "easeInOut",
  };
  return (
    <AnimatePresence>
      <ArpeggiosContext.Provider
        value={{
          keyName: ArpeggiosKeyName,
          keySignature: ArpeggiosSignatureName,
          instrumentArpeggios: instrumentArpeggios,
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
            {/* <motion.div className={classes.scalesLinkFilterItemContainer}>
              <motion.select
                id="key_signature"
                className={classes.scaleKeySignature}
                onChange={handleKeySignatureChange}
                defaultValue={keySignature}
                ref={selectArpeggioKeyRef}
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
            </motion.div> */}
            {/* <motion.div className={classes.scalesLinkFilterItemBreak}>|</div> */}
            <motion.div className={classes.scalesLinkFilterItemContainer}>
              <motion.select
                id="key_octaves"
                className={classes.scaleOctaves}
                defaultValue={ArpeggiosOctaves}
              >
                {/* <motion.option value="1 octave" selected={scaleOctaves == "1 octave"}>
                1 octave
              </motion.option>
              <motion.option value="2 octaves" selected={scaleOctaves == "2 octaves"}>
                2 octaves
              </motion.option> */}
                <motion.option
                  value="3 octaves"
                  selected={ArpeggiosOctaves == "3 octaves"}
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
                defaultValue={instrumentArpeggios}
              >
                <motion.option
                  value="violin"
                  selected={instrumentArpeggios == "violin"}
                >
                  Violin
                </motion.option>
                <motion.option
                  value="viola"
                  selected={instrumentArpeggios == "viola"}
                >
                  Viola
                </motion.option>
              </motion.select>
            </motion.div>
          </motion.div>
          <motion.div className={classes.scalesMainLineBreak}></motion.div>
        </motion.div>
      </ArpeggiosContext.Provider>
    </AnimatePresence>
  );
}
