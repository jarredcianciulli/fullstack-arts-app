/// QUARTER NOTE TRIPLET SECTION
let firstSectionNotesQT = [];
let testFirstSectionNotesQT = [];

notesObject(
  scaleKeyLetter,
  "4",
  1,
  0,
  firstSectionNotesQT,
  testFirstSectionNotesQT
);

let staveMeasuresSystem1CA = new Stave(ctxX, ctxYIteration * 8, ctxWidth / 4);
let staveMeasuresSystem1CB = new Stave(ctxX, ctxYIteration * 9, ctxWidth / 5);

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
        firstSectionNotesQT.slice(indexArrayTracker1, indexArrayTracker1 + 6)
      );
      indexArrayTracker1 = indexArrayTracker1 + 6;

      if (index == 0) {
        const tuplet1 = new Vex.Tuplet(measureIteration1[index].slice(0, 3));
        const tuplet2 = new Vex.Tuplet(measureIteration1[index].slice(3, 6));
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
        Formatter.FormatAndDraw(context, measure1, measureIteration1[index]);

        tuplet1.setContext(context).draw();
        tuplet2.setContext(context).draw();
      } else if (index > 0) {
        const tuplet1 = new Vex.Tuplet(measureIteration1[index].slice(0, 3));
        const tuplet2 = new Vex.Tuplet(measureIteration1[index].slice(3, 6));
        if (index != 0) {
          tuplet2.setTupletLocation(-1);
        }
        if (index > 1) {
          tuplet1.setTupletLocation(-1);
        }
        measure1 = new Stave(measure1.width + measure1.x, measure1.y, width);
        measure1.setContext(context).draw();
        Formatter.FormatAndDraw(context, measure1, measureIteration1[index]);
        tuplet1.setContext(context).draw();
        tuplet2.setContext(context).draw();
      }
    }
  } else if (i == 1) {
    for (let index = 0; index < 5; index++) {
      measureIteration2.push(
        firstSectionNotesQT.slice(indexArrayTracker2, indexArrayTracker2 + 6)
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
        context.closeGroup();
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
        Formatter.FormatAndDraw(context, measure2, measureIteration2[index]);
        tuplet1.setContext(context).draw();
        tuplet2.setContext(context).draw();
      } else if (index == 3) {
        const tuplet1 = new Vex.Tuplet(measureIteration2[index].slice(0, 3));
        const tuplet2 = new Vex.Tuplet(measureIteration2[index].slice(3, 6));

        measure2 = new Stave(measure2.width + measure2.x, measure2.y, width);

        measure2
          .setContext(context)
          .setEndBarType(Vex.Barline.type.REPEAT_END)
          .draw();
        Formatter.FormatAndDraw(context, measure2, measureIteration2[index]);
        tuplet1.setContext(context).draw();
        tuplet2.setContext(context).draw();
      } else if (index == 4) {
        measure2 = new Stave(measure2.width + measure2.x, measure2.y, width);

        measure2.setContext(context).setEndBarType(Vex.Barline.type.END).draw();
        Formatter.FormatAndDraw(context, measure2, measureIteration2[index]);
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
        measure2 = new Stave(measure2.width + measure2.x, measure2.y, width);

        measure2.setContext(context).draw();
        Formatter.FormatAndDraw(context, measure2, measureIteration2[index]);
        if (index != 4) {
          tuplet1.setContext(context).draw();
          tuplet2.setContext(context).draw();
        }
      }
    }
  }
}
