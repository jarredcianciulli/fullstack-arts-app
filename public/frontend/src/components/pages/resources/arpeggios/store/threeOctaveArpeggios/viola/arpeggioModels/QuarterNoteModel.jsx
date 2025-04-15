import React, { useRef, useEffect, useContext, Fragment } from "react";
import notesObjectGenerator from "../notesObjectGenerator";
import { ArpeggiosContext } from "../../../../ArpeggiosContext";
import VexFlow from "vexflow";
import classes from "./ScaleNotesModels.module.css";

const Vex = VexFlow.Flow;
/// SIXTEENTH NOTE SECTION
export function ViolaQuarterNoteModel() {
  const { Stave, Beam, Formatter, Renderer, StaveNote } = Vex;

  const { keyName, ctxWidth, ctxX, ctxYIteration, ctxHeight, scaleX, scaleY } =
    useContext(ArpeggiosContext);
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
    let sequence = 1;

    /// QUARTER NOTE SECTION
    let firstSectionNotesQ = [];

    let testFirstSectionNoteQ = notesObjectGenerator(scaleKeyLetter, "4", 1, 0);

    testFirstSectionNoteQ.forEach((e, i) => {
      if (i == 11 || i == 17) {
        firstSectionNotesQ.push(
          new StaveNote(e).addModifier(new Vex.Annotation("1"))
        );
      } else if (
        ((i == 23 || i == 24 || i == 25) && sequence != 7) ||
        ((i == 20 || i == 21 || i == 22) && sequence == 7)
      ) {
        firstSectionNotesQ.push(
          new StaveNote(e).addModifier(new Vex.Annotation("4"))
        );
      } else if (
        ((i == 29 || i == 35) && sequence != 7) ||
        ((i == 26 || i == 32) && sequence == 7)
      ) {
        firstSectionNotesQ.push(
          new StaveNote(e).addModifier(new Vex.Annotation("2"))
        );
      } else {
        firstSectionNotesQ.push(new StaveNote(e));
      }
    });

    let staveMeasuresSystem1BA = new Stave(
      ctxX,
      ctxYIteration * 1,
      ctxWidth / 6
    );
    let staveMeasuresSystem1BB = new Stave(
      ctxX,
      ctxYIteration * 2,
      ctxWidth / 6
    );
    let staveMeasuresSystem1BC = new Stave(
      ctxX,
      ctxYIteration * 3,
      ctxWidth / 5
    );

    for (let i = 0; i < 2; i++) {
      let measureIteration1 = [];
      let measureIteration2 = [];
      let measureIteration3 = [];

      let measure1 = staveMeasuresSystem1BA;
      let measure2 = staveMeasuresSystem1BB;
      let measure3 = staveMeasuresSystem1BC;
      let indexArrayTracker1 = 0;
      let indexArrayTracker2 = 24;
      let indexArrayTracker3 = 32;
      let width;
      let ctxStartX;

      if (i == 0) {
        for (let index = 0; index < 6; index++) {
          measureIteration1.push(
            firstSectionNotesQ.slice(indexArrayTracker1, indexArrayTracker1 + 4)
          );
          indexArrayTracker1 = indexArrayTracker1 + 4;

          if (index == 0) {
            const group = context.openGroup();
            measure1
              .addClef("alto")
              .addKeySignature(scaleKey)
              .setTimeSignature("4/4")
              .setBegBarType(Vex.Barline.type.REPEAT_BEGIN)
              .setContext(context)
              .draw();
            context.closeGroup();
            ctxStartX = measure1.start_x;
            width = (ctxWidth - ctxStartX) / 6;
            context.svg.removeChild(group);
            measure1 = new Stave(
              staveMeasuresSystem1BA.x,
              staveMeasuresSystem1BA.y,
              width + ctxStartX
            );
            measure1
              .addClef("alto")
              .addKeySignature(scaleKey)
              .setTimeSignature("4/4")
              .setBegBarType(Vex.Barline.type.REPEAT_BEGIN)
              .setContext(context)
              .draw();
            Formatter.FormatAndDraw(
              context,
              measure1,
              measureIteration1[index]
            );
          } else if (index > 0) {
            measure1 = new Stave(
              measure1.width + measure1.x,
              measure1.y,
              width
            );
            measure1.setContext(context).draw();
            Formatter.FormatAndDraw(
              context,
              measure1,
              measureIteration1[index]
            );
          }
        }
      } else if (i == 1) {
        for (let index = 0; index < 7; index++) {
          measureIteration2.push(
            firstSectionNotesQ.slice(indexArrayTracker2, indexArrayTracker2 + 4)
          );
          indexArrayTracker2 = indexArrayTracker2 + 4;

          if (index == 0) {
            const group = context.openGroup();
            measure2
              .addClef("alto")
              .addKeySignature(scaleKey)
              .setContext(context)
              .draw();
            context.closeGroup();
            ctxStartX = measure2.start_x;
            width = (ctxWidth - ctxStartX) / 6.5;
            context.svg.removeChild(group);
            measure2 = new Stave(
              staveMeasuresSystem1BB.x,
              staveMeasuresSystem1BB.y,
              width + ctxStartX
            );
            measure2
              .addClef("alto")
              .addKeySignature(scaleKey)
              .setContext(context)
              .draw();
            Formatter.FormatAndDraw(
              context,
              measure2,
              measureIteration2[index]
            );
          } else if (index == 5) {
            measure2 = new Stave(
              measure2.width + measure2.x,
              measure2.y,
              width
            );

            measure2
              .setContext(context)
              .setEndBarType(Vex.Barline.type.REPEAT_END)
              .draw();
            Formatter.FormatAndDraw(
              context,
              measure2,
              measureIteration2[index]
            );
          } else if (index == 6) {
            width = (ctxWidth - ctxStartX) / 13;
            measure2 = new Stave(
              measure2.width + measure2.x,
              measure2.y,
              width
            );

            measure2
              .setContext(context)
              .setEndBarType(Vex.Barline.type.DOUBLE)
              .draw();
            Formatter.FormatAndDraw(
              context,
              measure2,
              measureIteration2[index]
            );
          } else if (index > 0) {
            measure2 = new Stave(
              measure2.width + measure2.x,
              measure2.y,
              width
            );

            measure2.setContext(context).draw();
            Formatter.FormatAndDraw(
              context,
              measure2,
              measureIteration2[index]
            );
          }
        }
      } else if (i == 2) {
        for (let index = 0; index < 5; index++) {
          measureIteration3.push(
            firstSectionNotesQ.slice(indexArrayTracker3, indexArrayTracker3 + 4)
          );
          indexArrayTracker3 = indexArrayTracker3 + 4;

          if (index == 0) {
            const group = context.openGroup();
            measure3
              .addClef("alto")
              .addKeySignature(scaleKey)
              .setContext(context)
              .draw();
            context.closeGroup();
            ctxStartX = measure3.start_x;
            width = (ctxWidth - ctxStartX) / 7;
            context.svg.removeChild(group);
            measure3 = new Stave(
              staveMeasuresSystem1BC.x,
              staveMeasuresSystem1BC.y,
              width + ctxStartX
            );
            measure3
              .addClef("alto")
              .addKeySignature(scaleKey)
              .setContext(context)
              .draw();
            Formatter.FormatAndDraw(
              context,
              measure3,
              measureIteration3[index]
            );
          } else if (index == 3) {
            measure3 = new Stave(
              measure3.width + measure3.x,
              measure3.y,
              width
            );

            measure3
              .setContext(context)
              .setEndBarType(Vex.Barline.type.REPEAT_END)
              .draw();
            Formatter.FormatAndDraw(
              context,
              measure3,
              measureIteration3[index]
            );
          } else if (index == 4) {
            measure3 = new Stave(
              measure3.width + measure3.x,
              measure3.y,
              width
            );

            measure3
              .setContext(context)
              .setEndBarType(Vex.Barline.type.END)
              .draw();
            Formatter.FormatAndDraw(
              context,
              measure3,
              measureIteration3[index]
            );
          } else if (index > 0) {
            measure3 = new Stave(
              measure3.width + measure3.x,
              measure3.y,
              width
            );

            measure3.setContext(context).draw();
            Formatter.FormatAndDraw(
              context,
              measure3,
              measureIteration3[index]
            );
          }
        }
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
export default ViolaQuarterNoteModel;
