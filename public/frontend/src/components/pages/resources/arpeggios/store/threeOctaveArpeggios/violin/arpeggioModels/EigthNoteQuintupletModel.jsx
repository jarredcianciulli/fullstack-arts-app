import React, { useRef, useEffect, useContext, Fragment } from "react";
import notesObjectGenerator from "../notesObjectGenerator";
import { ArpeggiosContext } from "../../../../ArpeggiosContext";

import VexFlow from "vexflow";
import classes from "./ScaleNotesModels.module.css";

const Vex = VexFlow.Flow;
/// SIXTEENTH NOTE SECTION
export function EigthNoteQuintupletModel() {
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
    let sequence = 3;
    let measure;
    let ctxStartX;
    let width;

    /// EIGHTH NOTE QUINTUPLET SECTION

    let eigthNoteQuintuplets = [];

    let eigthNoteQuintupletsTest = notesObjectGenerator(
      scaleKeyLetter,
      "8",
      5,
      0
    );

    eigthNoteQuintupletsTest.forEach((e, i) => {
      if (i == 11 || i == 17) {
        eigthNoteQuintuplets.push(
          new StaveNote(e).addModifier(new Vex.Annotation("1"))
        );
      } else if (
        ((i == 23 || i == 24 || i == 25) && sequence != 7) ||
        ((i == 20 || i == 21 || i == 22) && sequence == 7)
      ) {
        eigthNoteQuintuplets.push(
          new StaveNote(e).addModifier(new Vex.Annotation("4"))
        );
      } else if (
        ((i == 29 || i == 35) && sequence != 7) ||
        ((i == 26 || i == 32) && sequence == 7)
      ) {
        eigthNoteQuintuplets.push(
          new StaveNote(e).addModifier(new Vex.Annotation("2"))
        );
      } else {
        eigthNoteQuintuplets.push(new StaveNote(e));
      }
    });

    let staveMeasuresSystem1FA = new Stave(
      ctxX,
      ctxYIteration * 1,
      ctxWidth / 3
    );
    let staveMeasuresSystem1FB = new Stave(
      ctxX,
      ctxYIteration * 2,
      ctxWidth / 3
    );

    for (let i = 0; i < 6; i++) {
      let measureIteration1 = [];
      let measureIteration2 = [];
      if (i < 5) {
        let arrayIteration = i * 10;
        measureIteration1.push(
          eigthNoteQuintuplets[0 + arrayIteration],
          eigthNoteQuintuplets[1 + arrayIteration],
          eigthNoteQuintuplets[2 + arrayIteration],
          eigthNoteQuintuplets[3 + arrayIteration],
          eigthNoteQuintuplets[4 + arrayIteration]
        );
        measureIteration2.push(
          eigthNoteQuintuplets[5 + arrayIteration],
          eigthNoteQuintuplets[6 + arrayIteration],
          eigthNoteQuintuplets[7 + arrayIteration],
          eigthNoteQuintuplets[8 + arrayIteration],
          eigthNoteQuintuplets[9 + arrayIteration]
        );
        let tuplet1;
        let tuplet2;
        if (keyName == "f") {
          tuplet1 = new Vex.Tuplet(measureIteration1, {
            ratioed: false,
            bracketed: false,
            weight: "italic",
            y_offset:
              (i == 0 ? 10 : null) ||
              (i == 1 ? -25 : null) ||
              (i == 2 ? -25 : null) ||
              (i == 3 ? -25 : null) ||
              (i == 4 ? 9 : null),
          });
          tuplet2 = new Vex.Tuplet(measureIteration2, {
            ratioed: false,
            bracketed: false,
            location:
              (i == 0 ? Vex.Tuplet.LOCATION_BOTTOM : null) ||
              (i == 1 ? Vex.Tuplet.LOCATION_BOTTOM : null),
            y_offset:
              (i == 0 ? -10 : null) ||
              (i == 1 ? -25 : null) ||
              (i == 2 ? -25 : null) ||
              (i == 3 ? -15 : null) ||
              (i == 4 ? 2 : null),
          });
        } else if (keyName == "c") {
          tuplet1 = new Vex.Tuplet(measureIteration1, {
            ratioed: false,
            bracketed: false,
            weight: "italic",
            y_offset:
              (i == 0 ? 10 : null) ||
              (i == 1 ? -5 : null) ||
              (i == 2 ? -25 : null) ||
              (i == 3 ? -10 : null) ||
              (i == 4 ? 9 : null),
          });
          tuplet2 = new Vex.Tuplet(measureIteration2, {
            ratioed: false,
            bracketed: false,
            location:
              (i == 0 ? Vex.Tuplet.LOCATION_BOTTOM : null) ||
              (i == 1 ? Vex.Tuplet.LOCATION_BOTTOM : null),
            y_offset:
              (i == 0 ? -10 : null) ||
              (i == 1 ? -25 : null) ||
              (i == 2 ? -25 : null) ||
              (i == 3 ? -5 : null) ||
              (i == 4 ? 20 : null),
          });
        } else {
          tuplet1 = new Vex.Tuplet(measureIteration1, {
            ratioed: false,
            bracketed: false,
            weight: "italic",
            y_offset:
              (i == 0 ? 10 : null) ||
              (i == 1 && (keyName.slice(0, 1) == "A" || "B" || "G")
                ? -5
                : null) ||
              (i == 1 ? -15 : null) ||
              (i == 2 ? -25 : null) ||
              (i == 3 ? -10 : null) ||
              (i == 4 ? 9 : null),
          });
          tuplet2 = new Vex.Tuplet(measureIteration2, {
            ratioed: false,
            bracketed: false,
            location:
              (i == 0 && (keyName.slice(0, 1) == "A" || "B" || "G")
                ? Vex.Tuplet.LOCATION_TOP
                : null) ||
              (i == 0 ? Vex.Tuplet.LOCATION_BOTTOM : null) ||
              (i == 1 ? Vex.Tuplet.LOCATION_BOTTOM : null),
            y_offset:
              (i == 0 && (keyName.slice(0, 1) == "A" || "B" || "G")
                ? 5
                : null) ||
              (i == 0 ? -5 : null) ||
              (i == 1 ? -25 : null) ||
              (i == 2 ? -25 : null) ||
              (i == 3 ? -5 : null) ||
              (i == 4 && (keyName.slice(0, 1) == "A" || "B" || "G")
                ? 17
                : null) ||
              (i == 4 ? 0 : null),
          });
        }
        const beam1 = new Beam(measureIteration1);
        const beam2 = new Beam(measureIteration2);

        const notesMeasure2 = measureIteration1.concat(measureIteration2);
        if (i == 0) {
          measure = staveMeasuresSystem1FA;
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
            staveMeasuresSystem1FA.x,
            staveMeasuresSystem1FA.y,
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
          tuplet2.setTupletLocation(-1);
          const group = context.openGroup();

          measure = staveMeasuresSystem1FB;
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
            staveMeasuresSystem1FB.x,
            staveMeasuresSystem1FB.y,
            width + ctxStartX
          );
          measure
            .addClef("treble")
            .addKeySignature(scaleKey)
            .setContext(context)
            .draw();
        } else if (i == 4) {
          measure = new Stave(measure.width + measure.x, measure.y, width);
          staveMeasuresSystem1FB = measure;

          measure
            .setEndBarType(Vex.Barline.type.REPEAT_END)
            .setContext(context)
            .draw();
        } else if (i < 3) {
          measure = new Stave(measure.width + measure.x, measure.y, width);
          staveMeasuresSystem1FA = measure;

          measure.setContext(context).draw();
        } else {
          measure = new Stave(measure.width + measure.x, measure.y, width);
          staveMeasuresSystem1FB = measure;

          measure.setContext(context).draw();
        }

        if (i > 0 && i < 4) {
          if (i == 3) {
            tuplet1.setTupletLocation(-1);
          } else {
            tuplet1.setTupletLocation(-1);
            tuplet2.setTupletLocation(-1);
          }
        }
        Formatter.FormatAndDraw(context, measure, notesMeasure2);
        tuplet1.setContext(context).draw();
        tuplet2.setContext(context).draw();
        beam1.setContext(context).draw();
        beam2.setContext(context).draw();
      } else if (i == 5) {
        measure = new Stave(measure.width + measure.x, measure.y, width);
        const a = [];
        a.push(eigthNoteQuintuplets[eigthNoteQuintuplets.length - 1]);
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
export default EigthNoteQuintupletModel;
