import React, { useRef, useEffect, useContext, Fragment } from "react";
import notesObjectGenerator from "../notesObjectGenerator";
import { ScalesContext } from "../../../../ScalesContext";

import VexFlow from "vexflow";

import classes from "./ScaleNotesModels.module.css";

const Vex = VexFlow.Flow;
/// SIXTEENTH NOTE SECTION
export function EigthNoteModel() {
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
  } = useContext(ScalesContext);

  // Create an SVG renderer and attach it to the DIV element with ref=container.
  const container = useRef();
  const rendererRef = useRef();
  let context;
  // if (keyName != null) {
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
      ctxHeight * 2 + ctxX + ctxX + ctxX + ctxX
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
    let sequence = 2;

    /// EIGHTH NOTE DUPLET SECTION

    let eigthNoteDuplets = [];

    let eigthNoteDupletsTest = notesObjectGenerator(scaleKeyLetter, "8", 4, 0);

    eigthNoteDupletsTest.forEach((e, i) => {
      if (i == 11 || i == 17) {
        eigthNoteDuplets.push(
          new StaveNote(e).addModifier(new Vex.Annotation("1"))
        );
      } else if (
        ((i == 23 || i == 24 || i == 25) && sequence != 7) ||
        ((i == 20 || i == 21 || i == 22) && sequence == 7)
      ) {
        eigthNoteDuplets.push(
          new StaveNote(e).addModifier(new Vex.Annotation("4"))
        );
      } else if (
        ((i == 29 || i == 35) && sequence != 7) ||
        ((i == 26 || i == 32) && sequence == 7)
      ) {
        eigthNoteDuplets.push(
          new StaveNote(e).addModifier(new Vex.Annotation("2"))
        );
      } else {
        eigthNoteDuplets.push(new StaveNote(e));
      }
    });

    let staveMeasuresSystem1EA = new Stave(
      ctxX,
      ctxYIteration * 1,
      ctxWidth / 3
    );
    let staveMeasuresSystem1EB = new Stave(
      ctxX,
      ctxYIteration * 2,
      ctxWidth / 4
    );
    let width;
    let ctxStartX;
    let measure;
    for (let i = 0; i < 7; i++) {
      let measureIteration1 = [];
      let measureIteration2 = [];

      if (i < 6) {
        let arrayIteration = i * 8;
        measureIteration1.push(
          eigthNoteDuplets[0 + arrayIteration],
          eigthNoteDuplets[1 + arrayIteration],
          eigthNoteDuplets[2 + arrayIteration],
          eigthNoteDuplets[3 + arrayIteration]
        );
        measureIteration2.push(
          eigthNoteDuplets[4 + arrayIteration],
          eigthNoteDuplets[5 + arrayIteration],
          eigthNoteDuplets[6 + arrayIteration],
          eigthNoteDuplets[7 + arrayIteration]
        );
        const beam1 = new Beam(measureIteration1);
        const beam2 = new Beam(measureIteration2);

        const notesMeasure2 = measureIteration1.concat(measureIteration2);
        if (i == 0) {
          measure = new Stave(
            staveMeasuresSystem1EA.x,
            staveMeasuresSystem1EA.y,
            staveMeasuresSystem1EA.width
          );
          const group = context.openGroup();
          measure
            .addClef("treble")
            .addKeySignature(scaleKey)
            .setTimeSignature("4/4")
            .setBegBarType(Vex.Barline.type.REPEAT_BEGIN)
            .setContext(context)
            .draw();
          context.closeGroup();
          ctxStartX = measure.start_x;
          width = (ctxWidth - ctxStartX) / 3;
          context.svg.removeChild(group);
          measure = new Stave(
            staveMeasuresSystem1EA.x,
            staveMeasuresSystem1EA.y,
            width + ctxStartX
          );
          measure
            .addClef("treble")
            .addKeySignature(scaleKey)
            .setTimeSignature("4/4")
            .setBegBarType(Vex.Barline.type.REPEAT_BEGIN)
            .setContext(context)
            .draw();
        } else if (i == 3) {
          measure = staveMeasuresSystem1EB;
          const group = context.openGroup();
          measure
            .addClef("treble")
            .addKeySignature(scaleKey)
            .setContext(context)
            .draw();
          context.closeGroup();
          ctxStartX = measure.start_x;
          width = (ctxWidth - ctxStartX) / 4;
          context.svg.removeChild(group);
          measure = new Stave(
            staveMeasuresSystem1EB.x,
            staveMeasuresSystem1EB.y,
            width + ctxStartX
          );
          measure
            .addClef("treble")
            .addKeySignature(scaleKey)
            .setContext(context)
            .draw();
        } else if (i == 5) {
          measure = new Stave(measure.width + measure.x, measure.y, width);
          staveMeasuresSystem1EB = measure;

          measure
            .setEndBarType(Vex.Barline.type.REPEAT_END)
            .setContext(context)
            .draw();
        } else if (i < 3 && i != 0) {
          measure = new Stave(
            measure.width + measure.x,
            staveMeasuresSystem1EA.y,
            width
          );
          staveMeasuresSystem1EA = measure;
          measure.setContext(context).draw();
        } else {
          measure = new Stave(measure.width + measure.x, measure.y, width);
          staveMeasuresSystem1EB = measure;

          measure.setContext(context).draw();
        }
        Formatter.FormatAndDraw(context, measure, notesMeasure2);

        beam1.setContext(context).draw();
        beam2.setContext(context).draw();
      } else if (i == 6) {
        measure = new Stave(measure.width + measure.x, measure.y, width);
        const a = [];
        a.push(eigthNoteDuplets[eigthNoteDuplets.length - 1]);
        measure
          .setEndBarType(Vex.Barline.type.DOUBLE)
          .setContext(context)
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
export default EigthNoteModel;
