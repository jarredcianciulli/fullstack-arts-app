import React, { useRef, useEffect, useContext, Fragment } from "react";
import notesObjectGenerator from "../notesObjectGenerator";
import { ArpeggiosContext } from "../../../../ArpeggiosContext";

import VexFlow from "vexflow";
import classes from "./ScaleNotesModels.module.css";

const Vex = VexFlow.Flow;
/// SIXTEENTH NOTE SECTION
export function EigthNoteSextupletModel() {
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
    let sequence = 5;
    let measure;
    let ctxStartX;
    let width;

    /// EIGHTH NOTE SEXTUPLET SECTION

    let eigthNoteSextuplets = [];

    let eigthNoteSextupletsTest = notesObjectGenerator(
      scaleKeyLetter,
      "8",
      6,
      0
    );

    eigthNoteSextupletsTest.forEach((e, i) => {
      if (i == 11 || i == 17) {
        eigthNoteSextuplets.push(
          new StaveNote(e).addModifier(new Vex.Annotation("1"))
        );
      } else if (
        ((i == 23 || i == 24 || i == 25) && sequence != 7) ||
        ((i == 20 || i == 21 || i == 22) && sequence == 7)
      ) {
        eigthNoteSextuplets.push(
          new StaveNote(e).addModifier(new Vex.Annotation("4"))
        );
      } else if (
        ((i == 29 || i == 35) && sequence != 7) ||
        ((i == 26 || i == 32) && sequence == 7)
      ) {
        eigthNoteSextuplets.push(
          new StaveNote(e).addModifier(new Vex.Annotation("2"))
        );
      } else {
        eigthNoteSextuplets.push(new StaveNote(e));
      }
    });

    let staveMeasuresSystem1GA = new Stave(
      ctxX,
      ctxYIteration * 1,
      ctxWidth / 2
    );
    let staveMeasuresSystem1GB = new Stave(
      ctxX,
      ctxYIteration * 2,
      ctxWidth / 3
    );
    for (let i = 0; i < 5; i++) {
      let measureIteration1 = [];
      let measureIteration2 = [];
      if (i < 4) {
        let arrayIteration = i * 12;
        measureIteration1.push(
          eigthNoteSextuplets[0 + arrayIteration],
          eigthNoteSextuplets[1 + arrayIteration],
          eigthNoteSextuplets[2 + arrayIteration],
          eigthNoteSextuplets[3 + arrayIteration],
          eigthNoteSextuplets[4 + arrayIteration],
          eigthNoteSextuplets[5 + arrayIteration]
        );
        measureIteration2.push(
          eigthNoteSextuplets[6 + arrayIteration],
          eigthNoteSextuplets[7 + arrayIteration],
          eigthNoteSextuplets[8 + arrayIteration],
          eigthNoteSextuplets[9 + arrayIteration],
          eigthNoteSextuplets[10 + arrayIteration],
          eigthNoteSextuplets[11 + arrayIteration]
        );
        let tuplet1;
        let tuplet2;

        tuplet1 = new Vex.Tuplet(measureIteration1, {
          ratioed: false,
          bracketed: false,
          y_offset:
            (i == 0 ? 5 : null) ||
            (i == 1 ? -10 : null) ||
            (i == 2 ? -20 : null) ||
            (i == 3 ? 5 : null),
        });
        tuplet2 = new Vex.Tuplet(measureIteration2, {
          ratioed: false,
          bracketed: false,
          y_offset:
            (i == 0 ? 30 : null) ||
            (i == 1 ? -20 : null) ||
            (i == 2 ? -10 : null) ||
            (i == 3 ? 10 : null),
        });
        const beam1 = new Beam(measureIteration1);
        const beam2 = new Beam(measureIteration2);

        const notesMeasure2 = measureIteration1.concat(measureIteration2);
        if (i == 0) {
          const group = context.openGroup();

          measure = staveMeasuresSystem1GA;
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
            staveMeasuresSystem1GA.x,
            staveMeasuresSystem1GA.y,
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
          tuplet1.setTupletLocation(-1);
          tuplet2.setTupletLocation(-1);
          const group = context.openGroup();

          measure = staveMeasuresSystem1GB;
          measure
            .addClef("treble")
            .addKeySignature(scaleKey)
            .setContext(context)
            .draw();
          context.closeGroup();
          ctxStartX = measure.start_x;
          width = (ctxWidth - ctxStartX) / 3;
          context.svg.removeChild(group);
          measure = new Stave(
            staveMeasuresSystem1GB.x,
            staveMeasuresSystem1GB.y,
            width + ctxStartX
          );

          measure
            .addClef("treble")
            .addKeySignature(scaleKey)
            .setContext(context)
            .draw();
        } else if (i == 3) {
          measure = new Stave(measure.width + measure.x, measure.y, width);
          staveMeasuresSystem1GB = measure;

          measure
            .setEndBarType(Vex.Barline.type.REPEAT_END)
            .setContext(context)
            .draw();
        } else if (i < 2 && i > 0) {
          if (i == 1) {
            tuplet1.setTupletLocation(-1);
            tuplet2.setTupletLocation(-1);
          }
          measure = new Stave(measure.width + measure.x, measure.y, width);
          staveMeasuresSystem1GA = measure;

          measure.setContext(context).draw();
        } else {
          measure = new Stave(measure.width + measure.x, measure.y, width);
          staveMeasuresSystem1GB = measure;

          measure.setContext(context).draw();
        }
        Formatter.FormatAndDraw(context, measure, notesMeasure2);
        tuplet1.setContext(context).draw();
        tuplet2.setContext(context).draw();
        beam1.setContext(context).draw();
        beam2.setContext(context).draw();
      } else if (i == 4) {
        measure = new Stave(
          staveMeasuresSystem1GB.width + staveMeasuresSystem1GB.x,
          staveMeasuresSystem1GB.y,
          staveMeasuresSystem1GB.width
        );
        const a = [];
        a.push(eigthNoteSextuplets[eigthNoteSextuplets.length - 1]);
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

export default EigthNoteSextupletModel;
