import React, { useContext, useEffect, useState } from "react";
import classes from "./Arpeggios.module.css";
import { ArpeggiosProvider } from "./ArpeggiosContext";
import { ArpeggiosContext } from "./ArpeggiosContext";
import { useSearchParams } from "react-router-dom";
import Download from "../assets/subscription_download_icon.svg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Document, Page } from "react-pdf";

import { motion, AnimatePresence } from "framer-motion";

import { HalfNoteModel } from "./store/threeOctaveArpeggios/violin/arpeggioModels/HalfNoteModel";
import { QuarterNoteModel } from "./store/threeOctaveArpeggios/violin/arpeggioModels/QuarterNoteModel";
import { QuarterNoteTripletModel } from "./store/threeOctaveArpeggios/violin/arpeggioModels/QuarterNoteTripletModel";
import { EigthNoteModel } from "./store/threeOctaveArpeggios/violin/arpeggioModels/EigthNoteModel";
import { EigthNoteQuintupletModel } from "./store/threeOctaveArpeggios/violin/arpeggioModels/EigthNoteQuintupletModel";
import { EigthNoteSextupletModel } from "./store/threeOctaveArpeggios/violin/arpeggioModels/EigthNoteSextupletModel";
import { EigthNoteSeptupletModel } from "./store/threeOctaveArpeggios/violin/arpeggioModels/EigthNoteSeptupletModel";
import { SixteenthNoteModel } from "./store/threeOctaveArpeggios/violin/arpeggioModels/SixteenthNoteModel";

function PDFGenerator() {
  const [loadingText, setLoadingText] = useState("Download");
  const [isLoading, setIsLoading] = useState(false);
  const { keyName, keySignature, ArpeggiosOctaves, instrumentArpeggios } =
    useContext(ArpeggiosContext);
  let elements;
  elements = document.getElementById("myDiv1");

  useEffect(() => {
    elements = document.getElementById("myDiv1");
  }, [keyName, keySignature, instrumentArpeggios]);

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
      <ArpeggiosProvider>
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
      </ArpeggiosProvider>
    </AnimatePresence>
  );
}

export function ArpeggiosHeader() {
  return (
    <ArpeggiosProvider>
      <PDFGenerator />
    </ArpeggiosProvider>
  );
}
