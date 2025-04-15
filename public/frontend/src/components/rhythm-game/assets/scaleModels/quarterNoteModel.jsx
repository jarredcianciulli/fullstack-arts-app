/// QUARTER NOTE SECTION
let firstSectionNotesQ = [];
let testFirstSectionNotesQ = [];

notesObject(
  scaleKeyLetter,
  "4",
  1,
  0,
  firstSectionNotesQ,
  testFirstSectionNotesQ
);

let staveMeasuresSystem1BA = new Stave(ctxX, ctxYIteration * 5, ctxWidth / 4);
let staveMeasuresSystem1BB = new Stave(ctxX, ctxYIteration * 6, ctxWidth / 4);
let staveMeasuresSystem1BC = new Stave(ctxX, ctxYIteration * 7, ctxWidth / 5);

for (let i = 0; i < 3; i++) {
  let measureIteration1 = [];
  let measureIteration2 = [];
  let measureIteration3 = [];

  let measure1 = staveMeasuresSystem1BA;
  let measure2 = staveMeasuresSystem1BB;
  let measure3 = staveMeasuresSystem1BC;
  let indexArrayTracker1 = 0;
  let indexArrayTracker2 = 16;
  let indexArrayTracker3 = 32;
  let width;
  let ctxStartX;

  if (i == 0) {
    for (let index = 0; index < 4; index++) {
      measureIteration1.push(
        firstSectionNotesQ.slice(indexArrayTracker1, indexArrayTracker1 + 4)
      );
      indexArrayTracker1 = indexArrayTracker1 + 4;

      if (index == 0) {
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
        console.log(context);
        measure1 = new Stave(
          staveMeasuresSystem1BA.x,
          staveMeasuresSystem1BA.y,
          width + ctxStartX
        );
        measure1
          .addClef("treble")
          .addKeySignature(scaleKey)
          .setTimeSignature("4/4")
          .setBegBarType(Vex.Barline.type.REPEAT_BEGIN)
          .setContext(context)
          .draw();
        Formatter.FormatAndDraw(context, measure1, measureIteration1[index]);
      } else if (index > 0) {
        measure1 = new Stave(measure1.width + measure1.x, measure1.y, width);
        measure1.setContext(context).draw();
        Formatter.FormatAndDraw(context, measure1, measureIteration1[index]);
      }
    }
  } else if (i == 1) {
    for (let index = 0; index < 4; index++) {
      measureIteration2.push(
        firstSectionNotesQ.slice(indexArrayTracker2, indexArrayTracker2 + 4)
      );
      indexArrayTracker2 = indexArrayTracker2 + 4;

      if (index == 0) {
        const group = context.openGroup();
        measure2
          .addClef("treble")
          .addKeySignature(scaleKey)
          .setContext(context)
          .draw();
        context.closeGroup();
        ctxStartX = measure2.start_x;
        width = (ctxWidth - ctxStartX) / 4;
        context.svg.removeChild(group);
        measure2 = new Stave(
          staveMeasuresSystem1BB.x,
          staveMeasuresSystem1BB.y,
          width + ctxStartX
        );
        measure2
          .addClef("treble")
          .addKeySignature(scaleKey)
          .setContext(context)
          .draw();
        Formatter.FormatAndDraw(context, measure2, measureIteration2[index]);
      } else if (index > 0) {
        measure2 = new Stave(measure2.width + measure2.x, measure2.y, width);

        measure2.setContext(context).draw();
        Formatter.FormatAndDraw(context, measure2, measureIteration2[index]);
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
          .addClef("treble")
          .addKeySignature(scaleKey)
          .setContext(context)
          .draw();
        context.closeGroup();
        ctxStartX = measure3.start_x;
        width = (ctxWidth - ctxStartX) / 5;
        context.svg.removeChild(group);
        measure3 = new Stave(
          staveMeasuresSystem1BC.x,
          staveMeasuresSystem1BC.y,
          width + ctxStartX
        );
        measure3
          .addClef("treble")
          .addKeySignature(scaleKey)
          .setContext(context)
          .draw();
        Formatter.FormatAndDraw(context, measure3, measureIteration3[index]);
      } else if (index == 3) {
        measure3 = new Stave(measure3.width + measure3.x, measure3.y, width);

        measure3
          .setContext(context)
          .setEndBarType(Vex.Barline.type.REPEAT_END)
          .draw();
        Formatter.FormatAndDraw(context, measure3, measureIteration3[index]);
      } else if (index == 4) {
        measure3 = new Stave(measure3.width + measure3.x, measure3.y, width);

        measure3.setContext(context).setEndBarType(Vex.Barline.type.END).draw();
        Formatter.FormatAndDraw(context, measure3, measureIteration3[index]);
      } else if (index > 0) {
        measure3 = new Stave(measure3.width + measure3.x, measure3.y, width);

        measure3.setContext(context).draw();
        Formatter.FormatAndDraw(context, measure3, measureIteration3[index]);
      }
    }
  }
}
