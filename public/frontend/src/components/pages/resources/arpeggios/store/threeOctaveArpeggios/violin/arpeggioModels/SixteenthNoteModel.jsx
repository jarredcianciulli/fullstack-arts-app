import React, { useRef, useEffect, useContext, Fragment } from "react";
import notesObjectGenerator from "../notesObjectGenerator";
import { ArpeggiosContext } from "../../../../ArpeggiosContext";

import VexFlow from "vexflow";
import classes from "./ScaleNotesModels.module.css";

const Vex = VexFlow.Flow;
/// SIXTEENTH NOTE SECTION
export function SixteenthNoteModel() {
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
  // if (keyName != null) {
  useEffect(() => {
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
    let sequence = 8;

    let sixteenthNotes = [];
    let sixteenthNoteTest = [];

    let sixteenthNotesTest = notesObjectGenerator(
      scaleKeyLetter,
      "16",
      8,
      0,
      sixteenthNoteTest
    );

    sixteenthNotesTest.forEach((e, i) => {
      if (i == 11 || i == 17) {
        sixteenthNotes.push(
          new StaveNote(e).addModifier(new Vex.Annotation("1"))
        );
      } else if (
        ((i == 23 || i == 24 || i == 25) && sequence != 7) ||
        ((i == 20 || i == 21 || i == 22) && sequence == 7)
      ) {
        sixteenthNotes.push(
          new StaveNote(e).addModifier(new Vex.Annotation("4"))
        );
      } else if (
        ((i == 29 || i == 35) && sequence != 7) ||
        ((i == 26 || i == 32) && sequence == 7)
      ) {
        sixteenthNotes.push(
          new StaveNote(e).addModifier(new Vex.Annotation("2"))
        );
      } else {
        sixteenthNotes.push(new StaveNote(e));
      }
    });

    let staveMeasuresSystem1IA = new Stave(
      ctxX,
      ctxYIteration * 1,
      ctxWidth / 2
    );
    let staveMeasuresSystem1IB = new Stave(
      ctxX,
      ctxYIteration * 2,
      ctxWidth / 2
    );
    let width;
    let ctxStartX;
    let measure;
    for (let i = 0; i < 4; i++) {
      let measureIteration1 = [];
      let measureIteration2 = [];
      let measureIteration3 = [];
      let measureIteration4 = [];

      if (i < 3) {
        let arrayIteration = i * 16;
        measureIteration1.push(
          sixteenthNotes[0 + arrayIteration],
          sixteenthNotes[1 + arrayIteration],
          sixteenthNotes[2 + arrayIteration],
          sixteenthNotes[3 + arrayIteration]
        );
        measureIteration2.push(
          sixteenthNotes[4 + arrayIteration],
          sixteenthNotes[5 + arrayIteration],
          sixteenthNotes[6 + arrayIteration],
          sixteenthNotes[7 + arrayIteration]
        );
        measureIteration3.push(
          sixteenthNotes[8 + arrayIteration],
          sixteenthNotes[9 + arrayIteration],
          sixteenthNotes[10 + arrayIteration],
          sixteenthNotes[11 + arrayIteration]
        );
        measureIteration4.push(
          sixteenthNotes[12 + arrayIteration],
          sixteenthNotes[13 + arrayIteration],
          sixteenthNotes[14 + arrayIteration],
          sixteenthNotes[15 + arrayIteration]
        );
        const beam1 = new Beam(measureIteration1);
        const beam2 = new Beam(measureIteration2);
        const beam3 = new Beam(measureIteration3);
        const beam4 = new Beam(measureIteration4);

        const notesMeasure2 = measureIteration1
          .concat(measureIteration2)
          .concat(measureIteration3)
          .concat(measureIteration4);
        if (i == 0) {
          const group = context.openGroup();
          measure = staveMeasuresSystem1IA;

          measure
            .addClef("treble")
            .addKeySignature(scaleKey)
            .setTimeSignature("4/4")
            .setBegBarType(Vex.Barline.type.REPEAT_BEGIN)
            .setContext(context)
            .draw();
          context.closeGroup();
          ctxStartX = measure.start_x;
          width = (ctxWidth - ctxStartX) / 2;
          context.svg.removeChild(group);
          measure = new Stave(
            staveMeasuresSystem1IA.x,
            staveMeasuresSystem1IA.y,
            width + ctxStartX
          );
          measure
            .addClef("treble")
            .addKeySignature(scaleKey)
            .setTimeSignature("4/4")
            .setBegBarType(Vex.Barline.type.REPEAT_BEGIN)
            .setContext(context)
            .draw();
        } else if (i == 2) {
          const group = context.openGroup();
          measure = staveMeasuresSystem1IB;

          measure
            .addClef("treble")
            .addKeySignature(scaleKey)
            .setEndBarType(Vex.Barline.type.REPEAT_END)
            .setContext(context)
            .draw();
          context.closeGroup();
          ctxStartX = measure.start_x;
          width = (ctxWidth - ctxStartX) / 2;
          context.svg.removeChild(group);
          measure = new Stave(
            staveMeasuresSystem1IB.x,
            staveMeasuresSystem1IB.y,
            width + ctxStartX
          );
          measure
            .addClef("treble")
            .addKeySignature(scaleKey)
            .setEndBarType(Vex.Barline.type.REPEAT_END)
            .setContext(context)
            .draw();
        } else if (i < 2) {
          measure = new Stave(measure.width + measure.x, measure.y, width);
          staveMeasuresSystem1IA = measure;

          measure.setContext(context).draw();
        } else {
          measure = new Stave(measure.width + measure.x, measure.y, width);
          staveMeasuresSystem1IB = measure;

          measure.setContext(context).draw();
        }
        Formatter.FormatAndDraw(context, measure, notesMeasure2);

        beam1.setContext(context).draw();
        beam2.setContext(context).draw();
        beam3.setContext(context).draw();
        beam4.setContext(context).draw();
      } else if (i == 3) {
        measure = new Stave(measure.width + measure.x, measure.y, width);
        const a = [];
        a.push(sixteenthNotes[sixteenthNotes.length - 1]);
        measure.setEndBarType(Vex.Barline.type.END).setContext(context).draw();
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
