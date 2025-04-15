import React, { useRef, useEffect, useContext, Fragment } from "react";
import notesObjectGenerator from "../notesObjectGenerator";
import { ScalesContext } from "../../../../ScalesContext";

import VexFlow from "vexflow";
import classes from "./ScaleNotesModels.module.css";

const Vex = VexFlow.Flow;
/// SIXTEENTH NOTE SECTION
export function QuarterNoteTripletModel() {
  const { Stave, Formatter, Renderer, StaveNote } = Vex;

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
  container.currrent = "";
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
    let measure;

    /// QUARTER NOTE TRIPLET SECTION
    let firstSectionNotesQT = [];

    let testFirstSectionNotesQT = notesObjectGenerator(
      scaleKeyLetter,
      "4",
      2,
      0
    );
    testFirstSectionNotesQT.forEach((e, i) => {
      if (i == 11 || i == 17) {
        firstSectionNotesQT.push(
          new StaveNote(e).addModifier(new Vex.Annotation("1"))
        );
      } else if (
        ((i == 23 || i == 24 || i == 25) && sequence != 7) ||
        ((i == 20 || i == 21 || i == 22) && sequence == 7)
      ) {
        firstSectionNotesQT.push(
          new StaveNote(e).addModifier(new Vex.Annotation("4"))
        );
      } else if (
        ((i == 29 || i == 35) && sequence != 7) ||
        ((i == 26 || i == 32) && sequence == 7)
      ) {
        firstSectionNotesQT.push(
          new StaveNote(e).addModifier(new Vex.Annotation("2"))
        );
      } else {
        firstSectionNotesQT.push(new StaveNote(e));
      }
    });

    let staveMeasuresSystem1CA = new Stave(
      ctxX,
      ctxYIteration * 1,
      ctxWidth / 4
    );
    let staveMeasuresSystem1CB = new Stave(
      ctxX,
      ctxYIteration * 2,
      ctxWidth / 5
    );

    for (let i = 0; i < 2; i++) {
      let measureIteration1 = [];
      let measureIteration2 = [];

      let measure1 = staveMeasuresSystem1CA;
      let measure2 = staveMeasuresSystem1CB;
      let indexArrayTracker1 = 0;
      let indexArrayTracker2 = 24;
      let width;
      let ctxStartX;

      if (i == 0) {
        for (let index = 0; index < 4; index++) {
          measureIteration1.push(
            firstSectionNotesQT.slice(
              indexArrayTracker1,
              indexArrayTracker1 + 6
            )
          );
          indexArrayTracker1 = indexArrayTracker1 + 6;

          if (index == 0) {
            const tuplet1 = new Vex.Tuplet(
              measureIteration1[index].slice(0, 3)
            );
            const tuplet2 = new Vex.Tuplet(
              measureIteration1[index].slice(3, 6)
            );
            const group = context.openGroup();
            measure1
              .addClef("treble")
              .addKeySignature(scaleKey)
              .setTimeSignature("4/4")
              .setBegBarType(Vex.Barline.type.REPEAT_BEGIN)
              .setContext(context)
              .draw();
            context.closeGroup();
            ctxStartX = measure1.start_x;
            width = (ctxWidth - ctxStartX) / 4;
            context.svg.removeChild(group);
            measure1 = new Stave(
              staveMeasuresSystem1CA.x,
              staveMeasuresSystem1CA.y,
              width + ctxStartX
            );
            measure1
              .addClef("treble")
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

            tuplet1.setContext(context).draw();
            tuplet2.setContext(context).draw();
          } else if (index > 0) {
            const tuplet1 = new Vex.Tuplet(
              measureIteration1[index].slice(0, 3)
            );
            const tuplet2 = new Vex.Tuplet(
              measureIteration1[index].slice(3, 6)
            );
            if (index != 0) {
              tuplet2.setTupletLocation(-1);
            }
            if (index > 1) {
              tuplet1.setTupletLocation(-1);
            }
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
            tuplet1.setContext(context).draw();
            tuplet2.setContext(context).draw();
          }
        }
      } else if (i == 1) {
        for (let index = 0; index < 5; index++) {
          measureIteration2.push(
            firstSectionNotesQT.slice(
              indexArrayTracker2,
              indexArrayTracker2 + 6
            )
          );
          indexArrayTracker2 = indexArrayTracker2 + 6;

          if (index == 0) {
            const tuplet1 = new Vex.Tuplet(
              measureIteration2[index].slice(0, 3)
            ).setTupletLocation(-1);
            const tuplet2 = new Vex.Tuplet(
              measureIteration2[index].slice(3, 6)
            ).setTupletLocation(-1);

            const group = context.openGroup();
            measure2
              .addClef("treble")
              .addKeySignature(scaleKey)
              .setContext(context)
              .draw();
            context.closeGroup(group);
            ctxStartX = measure2.start_x;
            width = (ctxWidth - ctxStartX) / 5;
            context.svg.removeChild(group);
            measure2 = new Stave(
              staveMeasuresSystem1CB.x,
              staveMeasuresSystem1CB.y,
              width + ctxStartX
            );

            measure2
              .addClef("treble")
              .addKeySignature(scaleKey)
              .setContext(context)
              .draw();
            Formatter.FormatAndDraw(
              context,
              measure2,
              measureIteration2[index]
            );
            tuplet1.setContext(context).draw();
            tuplet2.setContext(context).draw();
          } else if (index == 3) {
            const tuplet1 = new Vex.Tuplet(
              measureIteration2[index].slice(0, 3)
            );
            const tuplet2 = new Vex.Tuplet(
              measureIteration2[index].slice(3, 6)
            );

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
            tuplet1.setContext(context).draw();
            tuplet2.setContext(context).draw();
          } else if (index == 4) {
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
            let tuplet1;
            let tuplet2;
            if (index != 4) {
              tuplet1 = new Vex.Tuplet(measureIteration2[index].slice(0, 3));
              tuplet2 = new Vex.Tuplet(measureIteration2[index].slice(3, 6));
            }
            if (index == 1) {
              tuplet1.setTupletLocation(-1);
              tuplet2.setTupletLocation(-1);
            }
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
            if (index != 4) {
              tuplet1.setContext(context).draw();
              tuplet2.setContext(context).draw();
            }
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
