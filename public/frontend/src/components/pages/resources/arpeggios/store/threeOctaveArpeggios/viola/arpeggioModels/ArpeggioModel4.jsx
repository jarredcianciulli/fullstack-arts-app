import React, { useRef, useEffect, useContext, useState } from "react";
import arpNotesObjectGenerator4 from "../arpNotesObjectGenerator4";
import arpNotesObjectGenerator5 from "../arpNotesObjectGenerator5";
import { ArpeggiosContext } from "../../../../ArpeggiosContext";
import VexFlow, { StaveModifierPosition } from "vexflow";
import classes from "./ScaleNotesModels.module.css";

import { motion, AnimatePresence } from "framer-motion";

const Vex = VexFlow.Flow;
/// SIXTEENTH NOTE SECTION
export function ViolaArpeggio3ctavesNoteModel4() {
  const {
    Stave,
    Beam,
    Formatter,
    Renderer,
    StaveNote,
    Accidental,
    ClefNote,
    Curve,
    Registry,
    addModifier,
  } = Vex;
  const [state, setState] = useState(false);
  const {
    keyName,
    ctxWidth,
    ctxX,
    ctxYIteration,
    ctxHeight,
    scaleX,
    scaleY,
    content,
    divElement,
    setDivElement,
  } = useContext(ArpeggiosContext);

  // Create an SVG renderer and attach it to the DIV element with ref=container.
  const container = useRef();
  const rendererRef = useRef();
  let context;

  useEffect(() => {
    setState(false);

    var registry = new Vex.Registry();
    Vex.Registry.enableDefaultRegistry(registry);

    var id = function (id) {
      return registry.getElementById(id);
    };
    setState(true);
    if (!keyName) {
      return;
    }
    container.current.innerHTML = "";
    if (rendererRef.current == null) {
      rendererRef.current = new Renderer(
        container.current,
        Renderer.Backends.SVG
      );
    } else {
      rendererRef.current = null;
      rendererRef.current = new Renderer(
        container.current,
        Renderer.Backends.SVG
      );
    }

    const renderer = rendererRef.current;

    // Configure the rendering context.
    renderer.resize((ctxWidth + ctxX + ctxX) * scaleX, ctxHeight * 3);
    context = renderer.getContext().scale(scaleX, scaleY);
    context.setViewBox(
      0,
      ctxHeight * scaleX,
      ctxWidth + ctxX + ctxX,
      ctxHeight * 3
    );
    let scaleKeyLetter;
    let scaleKey;
    if (keyName != null) {
      scaleKeyLetter = keyName.slice(0, 1).toLowerCase();
      scaleKey =
        keyName.slice(0, 1).toUpperCase() + keyName.slice(1, 2).toLowerCase();
    } else {
      return;
    }
    let measure;
    /// DIMISHED 7TH ARGEPPIO ARRAY

    let arpNotesObjectsArray = arpNotesObjectGenerator4(
      scaleKeyLetter,
      "16",
      1,
      0
    );

    /// MAJORMINOR 7TH ARGEPPIO ARRAY
    let arpNotesObjectsMm7Array = arpNotesObjectGenerator5(
      scaleKeyLetter,
      "16",
      1,
      0
    );

    ///DIMISHED 7TH ARPEGGIO ARRAY NOTES
    let minorRootArp = [];
    arpNotesObjectsArray.forEach((e, i) => {
      if ((i === 13 || i === 17 || i === 21) && keyName != "A") {
        minorRootArp.push(new StaveNote(e).addModifier(new Accidental("b"), 0));
      } else if (i === 14 || i === 18 || i === 22) {
        minorRootArp.push(new StaveNote(e).addModifier(new Accidental("#"), 0));
      } else if (keyName === "A" && (i === 13 || i === 17 || i === 21)) {
        minorRootArp.push(new StaveNote(e).addModifier(new Accidental("n"), 0));
      } else {
        minorRootArp.push(new StaveNote(e));
      }
      if (i === 7) {
        minorRootArp.push(new ClefNote("treble", "small"));
      }
      if (i === 15) {
        minorRootArp.push(new ClefNote("alto", "small"));
      }
    });
    console.log(minorRootArp);

    ///MAJORMINOR 7TH ARPEGGIO ARRAY
    let arpMm7Notes = [];
    arpNotesObjectsMm7Array.forEach((e, i) => {
      if (
        (i === 3 || i === 7 || i === 11 || i === 13 || i === 17 || i === 21) &&
        keyName != "A"
      ) {
        arpMm7Notes.push(new StaveNote(e).addModifier(new Accidental("b"), 0));
      } else if (
        (i === 3 || i === 7 || i === 11 || i === 13 || i === 17 || i === 21) &&
        keyName === "A"
      ) {
        arpMm7Notes.push(new StaveNote(e).addModifier(new Accidental("n"), 0));
      } else {
        arpMm7Notes.push(new StaveNote(e));
      }
      if (i === 7) {
        arpMm7Notes.push(new ClefNote("treble", "small"));
      }
      if (i === 15) {
        arpMm7Notes.push(new ClefNote("alto", "small"));
      }
    });

    Vex.Dot.buildAndAttach([arpMm7Notes[26]], { all: true });

    let staveMeasuresSystem1AA = new Stave(
      ctxX,
      ctxYIteration * 1,
      ctxWidth / 3.4
    );

    let width;

    const group = context.openGroup();
    let measure1 = staveMeasuresSystem1AA;
    let measure2 = staveMeasuresSystem1AA;
    let measure3 = staveMeasuresSystem1AA;
    measure1
      .setContext(context)
      .addClef("alto", "default")
      .setTimeSignature("3/4")
      .addKeySignature(scaleKey)
      .draw();
    context.closeGroup();
    let ctxStartX;
    ctxStartX = measure1.start_x;
    // ctxStartX = 100;
    width = (ctxWidth - ctxStartX) / 3.4;
    context.svg.removeChild(group);
    measure1 = new Stave(
      staveMeasuresSystem1AA.x,
      staveMeasuresSystem1AA.y,
      width + ctxStartX,
      {
        // space_above_staff_ln: 2,
        // space_below_staff_ln: 2,
        spacing_between_lines_px: 8.6,
        left_bar: false,
      }
    );
    measure1
      .setContext(context)
      .addClef("alto", "default")
      .setTimeSignature("3/4")
      .addKeySignature(scaleKey)
      .draw();

    const curve1 = new Curve(
      id(minorRootArp[0].attrs.id),
      id(minorRootArp[8].attrs.id),
      {
        spacing: 1,
        thickness: 1,
        x_shift: 0,
        y_shift: 50,
        position: Curve.Position.NEAR_HEAD,
        invert: true,
        cps: [
          {
            x: 10,
            y: 80,
          },
          {
            x: 10,
            y: 20,
          },
        ],
      }
    );
    const curve2 = new Curve(
      id(minorRootArp[9].attrs.id),
      id(minorRootArp[17].attrs.id),
      {
        spacing: 1,
        thickness: 1,
        x_shift: 0,
        y_shift: 50,
        position: Curve.Position.NEAR_HEAD,
        invert: true,
        cps: [
          {
            x: 20,
            y: 20,
          },
          {
            x: 10,
            y: 100,
          },
        ],
      }
    );

    const beam1 = new Beam(minorRootArp.slice(13, 17));
    const beam2 = new Beam(minorRootArp.slice(18, 22));
    const beam3 = new Beam(minorRootArp.slice(22, 26));

    // D7 Arpeggio Notes
    measure3 = new Stave(measure1.width + measure1.x, measure1.y, width, {
      // space_above_staff_ln: 2,
      // space_below_staff_ln: 2,
      spacing_between_lines_px: 8.6,
      left_bar: false,
    });
    measure3.setContext(context).draw();

    Formatter.FormatAndDraw(context, measure1, minorRootArp.slice(13, 26));
    beam1.setContext(context).draw();
    beam2.setContext(context).draw();
    beam3.setContext(context).draw();

    /// Mm7 Arpeggio Notes
    const beamMm7Group1 = new Beam(arpMm7Notes.slice(0, 4));
    const beamMm7Group2 = new Beam(arpMm7Notes.slice(4, 8));
    const beamMm7Group3 = new Beam(arpMm7Notes.slice(9, 13));

    Formatter.FormatAndDraw(context, measure3, arpMm7Notes.slice(0, 13));

    //Draw Beams
    beamMm7Group1.setContext(context).draw();
    beamMm7Group2.setContext(context).draw();
    beamMm7Group3.setContext(context).draw();
    // curve1.setContext(context).draw();
    // curve2.setContext(context).draw();

    //Second measure Minor Arpeggio
    measure2 = new Stave(measure3.width + measure3.x, measure3.y, width, {
      // space_above_staff_ln: 2,
      // space_below_staff_ln: 2,
      spacing_between_lines_px: 8.6,

      left_bar: false,
    });
    measure2.setContext(context).draw();

    const beamMm7Group4 = new Beam(arpMm7Notes.slice(13, 17));
    const beamMm7Group5 = new Beam(arpMm7Notes.slice(18, 22));
    const beamMm7Group6 = new Beam(arpMm7Notes.slice(22, 26));
    // const beam4B = new Beam(minorRootArp.slice(9, 12));
    // const beam5B = new Beam(minorRootArp.slice(12, 15));
    // const beam6B = new Beam(minorRootArp.slice(15, 18));

    // //Second measure Minor Arpeggio
    let staveMeasuresSystem1AB = new Stave(ctxX, ctxYIteration * 1, 0);

    staveMeasuresSystem1AB.width;
    let measure4 = staveMeasuresSystem1AB;
    measure4 = new Stave(
      measure2.width + measure2.x,
      measure2.y,
      ctxWidth - width * 3 - ctxStartX,
      {
        // space_above_staff_ln: 2,
        // space_below_staff_ln: 2,
        spacing_between_lines_px: 8.6,
        left_bar: false,
      }
    );
    measure4.setContext(context).setEndBarType(Vex.Barline.type.END).draw();
    Formatter.FormatAndDraw(context, measure2, arpMm7Notes.slice(13, 26));

    Formatter.FormatAndDraw(context, measure4, arpMm7Notes.slice(26, 27));
    console.log("hihihihihihih");

    beamMm7Group4.setContext(context).draw();
    beamMm7Group5.setContext(context).draw();
    beamMm7Group6.setContext(context).draw();

    // beam4B.setContext(context).draw();
    // beam5B.setContext(context).draw();
    // beam6B.setContext(context).draw();
    // tuplet1B.setContext(context).draw();
    // tuplet2B.setContext(context).draw();
    // tuplet3B.setContext(context).draw();
    // tuplet4B.setContext(context).draw();
    // tuplet5B.setContext(context).draw();
    // tuplet6B.setContext(context).draw();
  }, [keyName, state]);
  const transition_text = {
    duration: 0.3,
    ease: "easeInOut",
  };

  return (
    <>
      <ArpeggiosContext.Provider value={{ content: divElement }}>
        <AnimatePresence>
          <motion.div
            className={classes.scaleModel}
            ref={container}
            key="resource_scales_hf_vla"
            initial={{
              opacity: 0,
            }}
            animate={{ opacity: !state ? 1 : 0 }}
            transition={transition_text}
            exit={{ opacity: 0 }}
          ></motion.div>
        </AnimatePresence>
      </ArpeggiosContext.Provider>
    </>
  );
}
