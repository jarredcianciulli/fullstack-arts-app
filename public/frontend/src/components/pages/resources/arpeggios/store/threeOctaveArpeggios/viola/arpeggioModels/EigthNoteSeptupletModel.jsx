import React, { useRef, useEffect, useContext, Fragment } from "react";
import notesObjectGenerator from "../notesObjectGenerator";
import { ArpeggiosContext } from "../../../../ArpeggiosContext";

import VexFlow from "vexflow";
import classes from "./ScaleNotesModels.module.css";

const Vex = VexFlow.Flow;
/// SIXTEENTH NOTE SECTION
export function ViolaEigthNoteSeptupletModel() {
  const { Stave, Beam, Formatter, Renderer, StaveNote } = Vex;

  const {
    keyName,
    keyInfo,
    ctxWidth,
    ctxX,
    ctxYIteration,
    ctxHeight,
    scaleX,
    scaleY,
  } = useContext(ArpeggiosContext);

  // Create an SVG renderer and attach it to the DIV element with ref=container.
  const container = useRef();
  const rendererRef = useRef();
  let context;
  useEffect(() => {
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
    renderer.resize((ctxWidth + ctxX + ctxX) * scaleX, ctxHeight * 2);
    context = renderer.getContext().scale(scaleX, scaleY);
    context.setViewBox(
      0,
      ctxHeight * scaleX,
      ctxWidth + ctxX + ctxX,
      ctxHeight * 2
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
    let sequence = 4;
    let measure;
    let measure2;
    let measure3;
    let ctxStartX;
    let width;

    /// EIGHTH NOTE SEPTUPLET SECTION

    let eigthNoteSeptuplets = [];

    let eigthNoteSeptupletsTest = notesObjectGenerator(
      scaleKeyLetter,
      "8",
      7,
      0
    );

    eigthNoteSeptupletsTest.forEach((e, i) => {
      if (i == 11 || i == 17) {
        eigthNoteSeptuplets.push(
          new StaveNote(e).addModifier(new Vex.Annotation("1"))
        );
      } else if (
        ((i == 23 || i == 24 || i == 25) && sequence != 7) ||
        ((i == 20 || i == 21 || i == 22) && sequence == 7)
      ) {
        eigthNoteSeptuplets.push(
          new StaveNote(e).addModifier(new Vex.Annotation("4"))
        );
      } else if (
        ((i == 29 || i == 35) && sequence != 7) ||
        ((i == 26 || i == 32) && sequence == 7)
      ) {
        eigthNoteSeptuplets.push(
          new StaveNote(e).addModifier(new Vex.Annotation("2"))
        );
      } else {
        eigthNoteSeptuplets.push(new StaveNote(e));
      }
    });
    let staveMeasuresSystem1HA = new Stave(ctxX, ctxYIteration, ctxWidth / 4);
    let staveMeasuresSystem1HB = new Stave(ctxX, ctxYIteration, ctxWidth / 4);
    let staveMeasuresSystem1HC = new Stave(ctxX, ctxYIteration, ctxWidth / 4);
    for (let i = 0; i < 4; i++) {
      let measureIteration1 = [];
      let measureIteration2 = [];
      if (i < 3) {
        let arrayIteration = i * 14;
        measureIteration1.push(
          eigthNoteSeptuplets[0 + arrayIteration],
          eigthNoteSeptuplets[1 + arrayIteration],
          eigthNoteSeptuplets[2 + arrayIteration],
          eigthNoteSeptuplets[3 + arrayIteration],
          eigthNoteSeptuplets[4 + arrayIteration],
          eigthNoteSeptuplets[5 + arrayIteration],
          eigthNoteSeptuplets[6 + arrayIteration]
        );
        measureIteration2.push(
          eigthNoteSeptuplets[7 + arrayIteration],
          eigthNoteSeptuplets[8 + arrayIteration],
          eigthNoteSeptuplets[9 + arrayIteration],
          eigthNoteSeptuplets[10 + arrayIteration],
          eigthNoteSeptuplets[11 + arrayIteration],
          eigthNoteSeptuplets[12 + arrayIteration],
          eigthNoteSeptuplets[13 + arrayIteration]
        );
        let tuplet1;
        let tuplet2;
        tuplet1 = new Vex.Tuplet(measureIteration1, {
          ratioed: false,
          bracketed: false,
          y_offset:
            (i == 0 ? 10 : null) ||
            (i == 1 ? -20 : null) ||
            (i == 2 ? -10 : null),
        });
        tuplet2 = new Vex.Tuplet(measureIteration2, {
          ratioed: false,
          bracketed: false,
          y_offset:
            (i == 0 ? -5 : null) ||
            (i == 1 ? -20 : null) ||
            (i == 2 ? -7 : null),
        });
        const beam1 = new Beam(measureIteration1);
        const beam2 = new Beam(measureIteration2);

        const notesMeasure2 = measureIteration1.concat(measureIteration2);
        if (i == 0) {
          tuplet2.setTupletLocation(-1);
          const group = context.openGroup();
          measure = staveMeasuresSystem1HA;

          measure
            .addClef("alto")
            .addKeySignature(scaleKey)
            .setTimeSignature("4/4")
            .setBegBarType(Vex.Barline.type.REPEAT_BEGIN)
            .setContext(context)
            .draw();
          context.closeGroup();
          ctxStartX = measure.start_x;
          width = (ctxWidth - ctxStartX) / 3.3;
          context.svg.removeChild(group);

          measure = new Stave(
            staveMeasuresSystem1HA.x,
            staveMeasuresSystem1HA.y,
            width + ctxStartX
          );
          measure
            .addClef("alto")
            .addKeySignature(scaleKey)
            .setTimeSignature("4/4")
            .setBegBarType(Vex.Barline.type.REPEAT_BEGIN)
            .setContext(context)
            .draw();
        } else if (i == 1) {
          tuplet1.setTupletLocation(-1);
          tuplet2.setTupletLocation(-1);

          measure = new Stave(measure.width + measure.x, measure.y, width);
          staveMeasuresSystem1HB = measure;
          measure.setContext(context).draw();
        } else if (i == 2) {
          tuplet1.setTupletLocation(-1);
          tuplet2.setTupletLocation(-1);
          measure = staveMeasuresSystem1HC;

          measure = new Stave(
            staveMeasuresSystem1HB.width + staveMeasuresSystem1HB.x,
            staveMeasuresSystem1HB.y,
            width
          );

          measure
            .setEndBarType(Vex.Barline.type.REPEAT_END)
            .setContext(context)
            .draw();
        }
        Formatter.FormatAndDraw(context, measure, notesMeasure2);
        tuplet1.setContext(context).draw();
        tuplet2.setContext(context).draw();
        beam1.setContext(context).draw();
        beam2.setContext(context).draw();
      } else if (i == 3) {
        measure = new Stave(
          measure.width + measure.x,
          measure.y,
          ctxWidth - ctxStartX - width * 3
        );
        const a = [];
        a.push(eigthNoteSeptuplets[eigthNoteSeptuplets.length - 1]);
        measure
          .setContext(context)
          .setEndBarType(Vex.Barline.type.DOUBLE)
          .draw();
        Formatter.FormatAndDraw(context, measure, a);
      }
    }
  }, [keyName]);
  return (
    <>
      <Fragment>
        <div className={classes.scaleModel} ref={container}></div>
      </Fragment>
    </>
  );
}
export default ViolaEigthNoteSeptupletModel;
