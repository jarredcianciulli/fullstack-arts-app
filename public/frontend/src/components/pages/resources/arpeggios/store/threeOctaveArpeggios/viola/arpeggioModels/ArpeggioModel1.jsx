import React, { useRef, useEffect, useContext, useState } from "react";
import arpNotesObjectGenerator1 from "../arpNotesObjectGenerator1";
import { ArpeggiosContext } from "../../../../ArpeggiosContext";
import VexFlow, { StaveModifierPosition } from "vexflow";
import classes from "./ScaleNotesModels.module.css";

import { motion, AnimatePresence } from "framer-motion";

const Vex = VexFlow.Flow;
/// SIXTEENTH NOTE SECTION
export function ViolaArpeggio3ctavesNoteModel1() {
  const {
    Stave,
    Beam,
    Formatter,
    Renderer,
    StaveNote,
    Accidental,
    Curve,
    ClefNote,
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

    let arpNotesObjectsArray = arpNotesObjectGenerator1(
      scaleKeyLetter,
      "8",
      1,
      0
    );
    setState(false);

    ///MAJOR ARPEGGIO ARRAY
    let key = keyName.slice(0, 1);
    let arpMajorRootPosNotes = [];
    console.log(arpNotesObjectsArray);
    arpNotesObjectsArray.forEach((e, i) => {
      arpMajorRootPosNotes.push(new StaveNote(e));
      console.log(keyName);
      if (key == "A" || key == "B") {
        if (i === 2) {
          arpMajorRootPosNotes.push(new ClefNote("treble", "small"));
        }
        if (i === 14) {
          arpMajorRootPosNotes.push(new ClefNote("alto", "small"));
        }
      } else {
        if (i === 5) {
          arpMajorRootPosNotes.push(new ClefNote("treble", "small"));
        }
        if (i === 14) {
          arpMajorRootPosNotes.push(new ClefNote("alto", "small"));
        }
      }
    });
    console.log(keyName);
    ///MINOR ARPEGGIO ARRAY
    let minorRootArp = [];
    arpNotesObjectsArray.forEach((e, i) => {
      if (
        (i === 1 || i === 4 || i === 7 || i === 11 || i === 14 || i === 17) &&
        keyName != "A"
      ) {
        minorRootArp.push(new StaveNote(e).addModifier(new Accidental("b"), 0));
      } else if (keyName != "A") {
        minorRootArp.push(new StaveNote(e));
      }
      if (keyName === "A") {
        console.log(minorRootArp);
        if (i === 1 || i === 4 || i === 7 || i === 11 || i === 14 || i === 17) {
          minorRootArp.push(
            new StaveNote(e).addModifier(new Accidental("n"), 0)
          );
        } else {
          minorRootArp.push(new StaveNote(e));
        }
      }
      if (key == "A" || key == "B") {
        if (i === 2) {
          minorRootArp.push(new ClefNote("treble", "small"));
        }
        if (i === 14) {
          minorRootArp.push(new ClefNote("alto", "small"));
        }
      } else {
        if (i === 5) {
          minorRootArp.push(new ClefNote("treble", "small"));
        }
        if (i === 14) {
          minorRootArp.push(new ClefNote("alto", "small"));
        }
      }
    });
    console.log(minorRootArp);

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
    let tuplet1;
    let tuplet2;
    let tuplet3;
    let tuplet4;
    let tuplet5;
    let tuplet6;
    if (key == "A" || key == "B") {
      tuplet1 = new Vex.Tuplet(arpMajorRootPosNotes.slice(0, 3), {
        bracketed: false,
      });
      tuplet2 = new Vex.Tuplet(arpMajorRootPosNotes.slice(4, 7), {
        bracketed: false,
      });
      tuplet3 = new Vex.Tuplet(arpMajorRootPosNotes.slice(7, 10), {
        bracketed: false,
      });
      tuplet4 = new Vex.Tuplet(arpMajorRootPosNotes.slice(10, 13), {
        bracketed: false,
      });
      tuplet5 = new Vex.Tuplet(arpMajorRootPosNotes.slice(13, 16), {
        bracketed: false,
      });
      tuplet6 = new Vex.Tuplet(arpMajorRootPosNotes.slice(17, 20), {
        bracketed: false,
      });
    } else {
      tuplet1 = new Vex.Tuplet(arpMajorRootPosNotes.slice(0, 3), {
        bracketed: false,
      });
      tuplet2 = new Vex.Tuplet(arpMajorRootPosNotes.slice(3, 6), {
        bracketed: false,
      });
      tuplet3 = new Vex.Tuplet(arpMajorRootPosNotes.slice(7, 10), {
        bracketed: false,
      });
      tuplet4 = new Vex.Tuplet(arpMajorRootPosNotes.slice(10, 13), {
        bracketed: false,
      });
      tuplet5 = new Vex.Tuplet(arpMajorRootPosNotes.slice(13, 16), {
        bracketed: false,
      });
      tuplet6 = new Vex.Tuplet(arpMajorRootPosNotes.slice(17, 20), {
        bracketed: false,
      });
    }

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

    let beam1;
    let beam2;
    let beam3;
    let beam4;
    let beam5;
    let beam6;
    if (key == "A" || key == "B") {
      beam1 = new Beam(arpMajorRootPosNotes.slice(0, 3));
      beam2 = new Beam(arpMajorRootPosNotes.slice(4, 7));
      beam3 = new Beam(arpMajorRootPosNotes.slice(7, 10));
      beam4 = new Beam(arpMajorRootPosNotes.slice(10, 13));
      beam5 = new Beam(arpMajorRootPosNotes.slice(13, 16));
      beam6 = new Beam(arpMajorRootPosNotes.slice(17, 20));
    } else {
      beam1 = new Beam(arpMajorRootPosNotes.slice(0, 3));
      beam2 = new Beam(arpMajorRootPosNotes.slice(3, 6));
      beam3 = new Beam(arpMajorRootPosNotes.slice(7, 10));
      beam4 = new Beam(arpMajorRootPosNotes.slice(10, 13));
      beam5 = new Beam(arpMajorRootPosNotes.slice(13, 16));
      beam6 = new Beam(arpMajorRootPosNotes.slice(17, 20));
    }

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
    let tuplet1B;
    let tuplet2B;
    let tuplet3B;
    let tuplet4B;
    let tuplet5B;
    let tuplet6B;
    if (key == "A" || key == "B") {
      tuplet1B = new Vex.Tuplet(minorRootArp.slice(0, 3), {
        bracketed: false,
      });
      tuplet2B = new Vex.Tuplet(minorRootArp.slice(4, 7), {
        bracketed: false,
      });
      tuplet3B = new Vex.Tuplet(minorRootArp.slice(7, 10), {
        bracketed: false,
      });
      tuplet4B = new Vex.Tuplet(minorRootArp.slice(10, 13), {
        bracketed: false,
      });
      tuplet5B = new Vex.Tuplet(minorRootArp.slice(13, 16), {
        bracketed: false,
      });
      tuplet6B = new Vex.Tuplet(minorRootArp.slice(17, 20), {
        bracketed: false,
      });
    } else {
      tuplet1B = new Vex.Tuplet(minorRootArp.slice(0, 3), {
        bracketed: false,
      });
      tuplet2B = new Vex.Tuplet(minorRootArp.slice(3, 6), {
        bracketed: false,
      });
      tuplet3B = new Vex.Tuplet(minorRootArp.slice(7, 10), {
        bracketed: false,
      });
      tuplet4B = new Vex.Tuplet(minorRootArp.slice(10, 13), {
        bracketed: false,
      });
      tuplet5B = new Vex.Tuplet(minorRootArp.slice(13, 16), {
        bracketed: false,
      });
      tuplet6B = new Vex.Tuplet(minorRootArp.slice(17, 20), {
        bracketed: false,
      });
    }
    let beam1B;
    let beam2B;
    let beam3B;
    let beam4B;
    let beam5B;
    let beam6B;
    if (key == "A" || key == "B") {
      beam1B = new Beam(minorRootArp.slice(0, 3));
      beam2B = new Beam(minorRootArp.slice(4, 7));
      beam3B = new Beam(minorRootArp.slice(7, 10));
      beam4B = new Beam(minorRootArp.slice(10, 13));
      beam5B = new Beam(minorRootArp.slice(13, 16));
      beam6B = new Beam(minorRootArp.slice(17, 20));
    } else {
      beam1B = new Beam(minorRootArp.slice(0, 3));
      beam2B = new Beam(minorRootArp.slice(3, 6));
      beam3B = new Beam(minorRootArp.slice(7, 10));
      beam4B = new Beam(minorRootArp.slice(10, 13));
      beam5B = new Beam(minorRootArp.slice(13, 16));
      beam6B = new Beam(minorRootArp.slice(17, 20));
    }

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
