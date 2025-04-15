import React, { useEffect } from "react";

/// HALFNOTES SECTION
let firstSectionNotes = [];
let testFirstSectionNotes = [];

notesObject(
  scaleKeyLetter,
  "2",
  1,
  0,
  firstSectionNotes,
  testFirstSectionNotes
);
97536;
let staveMeasuresSystem1AA = new Stave(ctxX, ctxYIteration * 1, ctxWidth / 6);
let staveMeasuresSystem1AB = new Stave(ctxX, ctxYIteration * 2, ctxWidth / 6);
let staveMeasuresSystem1AC = new Stave(ctxX, ctxYIteration * 3, ctxWidth / 6);
let staveMeasuresSystem1AD = new Stave(ctxX, ctxYIteration * 4, ctxWidth / 7);

for (let i = 0; i < 4; i++) {
  let measureIteration1 = [];
  let measureIteration2 = [];
  let measureIteration3 = [];
  let measureIteration4 = [];
  let measure1 = staveMeasuresSystem1AA;
  let measure2 = staveMeasuresSystem1AB;
  let measure3 = staveMeasuresSystem1AC;
  let measure4 = staveMeasuresSystem1AD;
  let width;
  let indexArrayTracker1 = 0;
  let indexArrayTracker2 = 12;
  let indexArrayTracker3 = 24;
  let indexArrayTracker4 = 36;
  let ctxStartX;
  if (i == 0) {
    for (let index = 0; index < 6; index++) {
      measureIteration1.push(
        firstSectionNotes.slice(indexArrayTracker1, indexArrayTracker1 + 2)
      );
      indexArrayTracker1 = indexArrayTracker1 + 2;

      if (index == 0 && i == 0) {
        const group = context.openGroup();
        measure1
          .addClef("treble")
          .setBegBarType(Vex.Barline.type.REPEAT_BEGIN)
          .setTimeSignature("4/4")
          .addKeySignature(scaleKey)
          .setContext(context)
          .draw();
        context.closeGroup();
        ctxStartX = measure1.start_x;
        console.log(measure1.start_x);
        width = (ctxWidth - ctxStartX) / 6;
        context.svg.removeChild(group);
        console.log(context);
        measure1 = new Stave(
          staveMeasuresSystem1AA.x,
          staveMeasuresSystem1AA.y,
          width + ctxStartX
        );

        measure1
          .addClef("treble")
          .setBegBarType(Vex.Barline.type.REPEAT_BEGIN)
          .setTimeSignature("4/4")
          .addKeySignature(scaleKey)
          .setContext(context)
          .draw();

        Formatter.FormatAndDraw(context, measure1, measureIteration1[index]);
      } else if (index > 0 && i == 0) {
        // let width =
        //   (ctxWidth - (staveMeasuresSystem1AA.width + ctxStartX)) / 5;
        // console.log(
        //   ctxWidth,
        //   (ctxWidth - staveMeasuresSystem1AA.width + ctxStartX) / 5
        // );
        // console.log(measure1.x);
        measure1 = new Stave(measure1.width + measure1.x, measure1.y, width);
        measure1.setContext(context).draw();
        Formatter.FormatAndDraw(context, measure1, measureIteration1[index]);
      }
    }
  } else if (i == 1) {
    for (let index = 0; index < 6; index++) {
      measureIteration2.push(
        firstSectionNotes.slice(indexArrayTracker2, indexArrayTracker2 + 2)
      );
      indexArrayTracker2 = indexArrayTracker2 + 2;

      if (index == 0 && i == 1) {
        const group = context.openGroup();
        measure2
          .addClef("treble")
          .addKeySignature(scaleKey)
          .setContext(context)
          .draw();
        context.closeGroup();
        ctxStartX = measure2.start_x;
        width = (ctxWidth - ctxStartX) / 6;
        context.svg.removeChild(group);
        console.log(context);
        measure2 = new Stave(
          staveMeasuresSystem1AB.x,
          staveMeasuresSystem1AB.y,
          width + ctxStartX
        );

        measure2
          .addClef("treble")
          .addKeySignature(scaleKey)
          .setContext(context)
          .draw();

        Formatter.FormatAndDraw(context, measure2, measureIteration2[index]);
      } else if (index > 0 && i == 1) {
        measure2 = new Stave(measure2.width + measure2.x, measure2.y, width);

        measure2.setContext(context).draw();
        Formatter.FormatAndDraw(context, measure2, measureIteration2[index]);
      }
    }
  } else if (i == 2) {
    for (let index = 0; index < 6; index++) {
      measureIteration3.push(
        firstSectionNotes.slice(indexArrayTracker3, indexArrayTracker3 + 2)
      );
      indexArrayTracker3 = indexArrayTracker3 + 2;

      if (index == 0 && i == 2) {
        const group = context.openGroup();
        measure3
          .addClef("treble")
          .addKeySignature(scaleKey)
          .setContext(context)
          .draw();
        context.closeGroup();
        ctxStartX = measure3.start_x;
        width = (ctxWidth - ctxStartX) / 6;
        context.svg.removeChild(group);
        console.log(context);
        measure3 = new Stave(
          staveMeasuresSystem1AC.x,
          staveMeasuresSystem1AC.y,
          width + ctxStartX
        );

        measure3
          .addClef("treble")
          .addKeySignature(scaleKey)
          .setContext(context)
          .draw();
        Formatter.FormatAndDraw(context, measure3, measureIteration3[index]);
      } else if (index > 0 && i == 2) {
        measure3 = new Stave(measure3.width + measure3.x, measure3.y, width);

        measure3.setContext(context).draw();
        Formatter.FormatAndDraw(context, measure3, measureIteration3[index]);
      }
    }
  } else if (i == 3) {
    for (let index = 0; index < 7; index++) {
      measureIteration4.push(
        firstSectionNotes.slice(indexArrayTracker4, indexArrayTracker4 + 2)
      );
      indexArrayTracker4 = indexArrayTracker4 + 2;

      if (index == 0 && i == 3) {
        const group = context.openGroup();
        measure4
          .addClef("treble")
          .addKeySignature(scaleKey)
          .setContext(context)
          .draw();
        context.closeGroup();
        ctxStartX = measure4.start_x;
        width = (ctxWidth - ctxStartX) / 7;
        context.svg.removeChild(group);
        console.log(context);
        measure4 = new Stave(
          staveMeasuresSystem1AD.x,
          staveMeasuresSystem1AD.y,
          width + ctxStartX
        );
        measure4
          .addClef("treble")
          .addKeySignature(scaleKey)
          .setContext(context)
          .draw();
        Formatter.FormatAndDraw(context, measure4, measureIteration4[index]);
      } else if (index == 5 && i == 3) {
        measure4 = new Stave(measure4.width + measure4.x, measure4.y, width);

        measure4
          .setContext(context)
          .setEndBarType(Vex.Barline.type.REPEAT_END)
          .draw();
        Formatter.FormatAndDraw(context, measure4, measureIteration4[index]);
      } else if (index == 6 && i == 3) {
        measure4 = new Stave(measure4.width + measure4.x, measure4.y, width);

        measure4.setContext(context).setEndBarType(Vex.Barline.type.END).draw();
        Formatter.FormatAndDraw(context, measure4, measureIteration4[index]);
      } else if (index > 0 && i == 3) {
        measure4 = new Stave(measure4.width + measure4.x, measure4.y, width);

        measure4.setContext(context).draw();
        Formatter.FormatAndDraw(context, measure4, measureIteration4[index]);
      }
    }
  }
}
