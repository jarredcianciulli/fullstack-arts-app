import React, { useRef, useEffect, useContext, useState } from "react";
import arpNotesObjectGenerator2 from "../arpNotesObjectGenerator2";
import arpNotesObjectGenerator3 from "../arpNotesObjectGenerator3";
import { ArpeggiosContext } from "../../../../ArpeggiosContext";
import VexFlow, { StaveModifierPosition } from "vexflow";
import classes from "./ScaleNotesModels.module.css";

import { motion, AnimatePresence } from "framer-motion";

const Vex = VexFlow.Flow;
/// SIXTEENTH NOTE SECTION
export function ViolaArpeggio3ctavesNoteModel2() {
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
    /// MAJOR ROOT POSITION
    let measure;
    let key = keyName.slice(0, 1);

    let arpNotesObjectsArray1 = arpNotesObjectGenerator2(
      scaleKeyLetter,
      "8",
      1,
      0
    );

    let arpNotesObjectsArray2 = arpNotesObjectGenerator3(
      scaleKeyLetter,
      "8",
      1,
      0
    );
    setState(false);

    ///MAJOR 6/3 ARPEGGIO ARRAY, VI SCALE DEGREE
    let arpMajorRootPosNotes = [];
    arpNotesObjectsArray1.forEach((e, i) => {
      if (i === 1 && keyName != "A") {
        arpMajorRootPosNotes.push(
          new StaveNote(e).addModifier(new Accidental("n"), 0)
        );
      } else {
        arpMajorRootPosNotes.push(new StaveNote(e));
      }
      if (i === 5) {
        arpMajorRootPosNotes.push(new ClefNote("treble", "small"));
      }
      if (i === 14) {
        arpMajorRootPosNotes.push(new ClefNote("alto", "small"));
      }
    });
    ///MAJOR 6/4 ARPEGGIO ARRAY, IV SCALE DEGREE
    let minorRootArp = [];
    arpNotesObjectsArray2.forEach((e, i) => {
      if (i === 1 || i === 4 || i === 7 || i === 10 || i === 13 || i === 16) {
        minorRootArp.push(new StaveNote(e));
      } else {
        minorRootArp.push(new StaveNote(e));
      }
      if (i === 5) {
        minorRootArp.push(new ClefNote("treble", "small"));
      }
      if (i === 14) {
        minorRootArp.push(new ClefNote("alto", "small"));
      }
    });

    let staveMeasuresSystem1AA = new Stave(
      ctxX,
      ctxYIteration * 1,
      ctxWidth / 4
    );
    let staveMeasuresSystem1AB = new Stave(
      ctxX,
      ctxYIteration * 1,
      ctxWidth / 4
    );

    let width;

    const group = context.openGroup();
    let measure1 = staveMeasuresSystem1AA;
    let measure2 = staveMeasuresSystem1AB;
    let measure3 = staveMeasuresSystem1AA;
    let measure4 = staveMeasuresSystem1AA;
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
    width = (ctxWidth - ctxStartX) / 4;
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

    const tuplet1 = new Vex.Tuplet(arpMajorRootPosNotes.slice(0, 3), {
      bracketed: false,
    });
    const tuplet2 = new Vex.Tuplet(arpMajorRootPosNotes.slice(3, 6), {
      bracketed: false,
    });
    const tuplet3 = new Vex.Tuplet(arpMajorRootPosNotes.slice(7, 10), {
      bracketed: false,
    });
    const tuplet4 = new Vex.Tuplet(arpMajorRootPosNotes.slice(10, 13), {
      bracketed: false,
    });
    const tuplet5 = new Vex.Tuplet(arpMajorRootPosNotes.slice(13, 16), {
      bracketed: false,
    });
    const tuplet6 = new Vex.Tuplet(arpMajorRootPosNotes.slice(17, 20), {
      bracketed: false,
    });

    const curve1 = new Curve(
      id(arpMajorRootPosNotes[0].attrs.id),
      id(arpMajorRootPosNotes[9].attrs.id),
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
      id(arpMajorRootPosNotes[10].attrs.id),
      id(arpMajorRootPosNotes[19].attrs.id),
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

    const beam1 = new Beam(arpMajorRootPosNotes.slice(0, 3));
    const beam2 = new Beam(arpMajorRootPosNotes.slice(3, 6));
    const beam3 = new Beam(arpMajorRootPosNotes.slice(7, 10));
    const beam4 = new Beam(arpMajorRootPosNotes.slice(10, 13));
    const beam5 = new Beam(arpMajorRootPosNotes.slice(13, 16));
    const beam6 = new Beam(arpMajorRootPosNotes.slice(17, 20));

    //Second measure Minor Arpeggio
    measure3 = new Stave(measure1.width + measure1.x, measure1.y, width, {
      // space_above_staff_ln: 2,
      // space_below_staff_ln: 2,
      spacing_between_lines_px: 8.6,
      left_bar: false,
    });
    measure3.setContext(context).draw();

    Formatter.FormatAndDraw(
      context,
      measure1,
      arpMajorRootPosNotes.slice(0, 10)
    );
    beam1.setContext(context).draw();
    beam2.setContext(context).draw();
    beam3.setContext(context).draw();
    Formatter.FormatAndDraw(
      context,
      measure3,
      arpMajorRootPosNotes.slice(10, 20)
    );
    beam4.setContext(context).draw();
    beam5.setContext(context).draw();
    beam6.setContext(context).draw();
    tuplet1.setContext(context).draw();
    tuplet2.setContext(context).draw();
    tuplet3.setContext(context).draw();
    tuplet4.setContext(context).draw();
    tuplet5.setContext(context).draw();
    tuplet6.setContext(context).draw();
    curve1.setContext(context).draw();
    curve2.setContext(context).draw();

    //Second measure Minor Arpeggio
    measure2 = new Stave(measure3.width + measure3.x, measure3.y, width, {
      // space_above_staff_ln: 2,
      // space_below_staff_ln: 2,
      spacing_between_lines_px: 8.6,

      left_bar: false,
    });
    measure2.setContext(context).draw();
    const tuplet1B = new Vex.Tuplet(minorRootArp.slice(0, 3), {
      bracketed: false,
    });
    const tuplet2B = new Vex.Tuplet(minorRootArp.slice(3, 6), {
      bracketed: false,
    });
    const tuplet3B = new Vex.Tuplet(minorRootArp.slice(7, 10), {
      bracketed: false,
    });
    const tuplet4B = new Vex.Tuplet(minorRootArp.slice(10, 13), {
      bracketed: false,
    });
    const tuplet5B = new Vex.Tuplet(minorRootArp.slice(13, 16), {
      bracketed: false,
    });
    const tuplet6B = new Vex.Tuplet(minorRootArp.slice(17, 20), {
      bracketed: false,
    });
    const beam1B = new Beam(minorRootArp.slice(0, 3));
    const beam2B = new Beam(minorRootArp.slice(3, 6));
    const beam3B = new Beam(minorRootArp.slice(7, 10));
    const beam4B = new Beam(minorRootArp.slice(10, 13));
    const beam5B = new Beam(minorRootArp.slice(13, 16));
    const beam6B = new Beam(minorRootArp.slice(17, 20));

    //Second measure Minor Arpeggio
    measure4 = new Stave(measure2.width + measure2.x, measure2.y, width, {
      // space_above_staff_ln: 2,
      // space_below_staff_ln: 2,
      spacing_between_lines_px: 8.6,
      left_bar: false,
    });
    measure4.setContext(context).draw();
    Formatter.FormatAndDraw(context, measure2, minorRootArp.slice(0, 10));

    Formatter.FormatAndDraw(context, measure4, minorRootArp.slice(10, 20));
    beam1B.setContext(context).draw();
    beam2B.setContext(context).draw();
    beam3B.setContext(context).draw();
    beam4B.setContext(context).draw();
    beam5B.setContext(context).draw();
    beam6B.setContext(context).draw();
    tuplet1B.setContext(context).draw();
    tuplet2B.setContext(context).draw();
    tuplet3B.setContext(context).draw();
    tuplet4B.setContext(context).draw();
    tuplet5B.setContext(context).draw();
    tuplet6B.setContext(context).draw();
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
