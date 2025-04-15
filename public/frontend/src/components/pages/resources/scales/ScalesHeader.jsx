import React, { useContext, useEffect, useState, Fragment } from "react";
import classes from "./Scales.module.css";
import { ScalesProvider } from "./ScalesContext";
import { ScalesContext } from "./ScalesContext";
import { useSearchParams } from "react-router-dom";
import Download from "../assets/subscription_download_icon.svg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Document, Page } from "react-pdf";

import { motion, AnimatePresence } from "framer-motion";

import { HalfNoteModel } from "./store/threeOctaveScales/violin/scaleModels/HalfNoteModel";
import { QuarterNoteModel } from "./store/threeOctaveScales/violin/scaleModels/QuarterNoteModel";
import { QuarterNoteTripletModel } from "./store/threeOctaveScales/violin/scaleModels/QuarterNoteTripletModel";
import { EigthNoteModel } from "./store/threeOctaveScales/violin/scaleModels/EigthNoteModel";
import { EigthNoteQuintupletModel } from "./store/threeOctaveScales/violin/scaleModels/EigthNoteQuintupletModel";
import { EigthNoteSextupletModel } from "./store/threeOctaveScales/violin/scaleModels/EigthNoteSextupletModel";
import { EigthNoteSeptupletModel } from "./store/threeOctaveScales/violin/scaleModels/EigthNoteSeptupletModel";
import { SixteenthNoteModel } from "./store/threeOctaveScales/violin/scaleModels/SixteenthNoteModel";

function PDFGenerator() {
  const [loadingText, setLoadingText] = useState("Download");
  const [isLoading, setIsLoading] = useState(false);
  const { keyName, keySignature, scaleOctaves, instrumentScale } =
    useContext(ScalesContext);
  let elements;
  elements = document.getElementById("myDiv1");

  useEffect(() => {
    elements = document.getElementById("myDiv1");
  }, [keyName, keySignature, instrumentScale]);

  function printDocument() {
    setIsLoading(true);
    setLoadingText("Loading...");
    console.log(elements);
    html2canvas(elements).then((input) => {
      const imgData = input.toDataURL("png");
      const pdf = new jsPDF("p", "mm", "a4");
      var width = pdf.internal.pageSize.getWidth();
      var height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 10, width, height);
      pdf.save(`violin-scale_system.pdf`);
      setLoadingText("Complete!");
      setTimeout(function () {
        setLoadingText("Download");
        setIsLoading(false);
      }, 3000);
    });
  }
  const transition_text = {
    duration: 0.3,
    ease: "easeInOut",
  };

  return (
    <AnimatePresence>
      <ScalesProvider>
        <motion.div
          className={classes.scalesMainContainer}
          key="resource_scales_download_pdf"
          initial={{
            opacity: 0,
          }}
          animate={{ opacity: 1 }}
          transition={transition_text}
          exit={{ opacity: 0 }}
        >
          <motion.div className={classes.scalesLinkBackContainer}>
            <motion.button
              className={classes.scalesResourcesDownloadImgContainer}
              onClick={printDocument}
              disabled={isLoading}
            >
              <motion.img
                src={Download}
                alt="download icon"
                className={classes.scalesResourcesDownloadImg}
              ></motion.img>

              <motion.div className={classes.scalesResourcesDownloadText}>
                {loadingText}
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>
      </ScalesProvider>
    </AnimatePresence>
  );
}

export function ScalesHeader() {
  return (
    <ScalesProvider>
      <PDFGenerator />
    </ScalesProvider>
  );
}
