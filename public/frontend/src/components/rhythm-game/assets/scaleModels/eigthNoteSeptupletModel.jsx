/// EIGHTH NOTE SEPTUPLET SECTION

let eigthNoteSeptuplets = [];
let eigthNoteSeptupletsTest = [];

notesObject(
  scaleKeyLetter,
  "8",
  7,
  0,
  eigthNoteSeptuplets,
  eigthNoteSeptupletsTest
);

let staveMeasuresSystem1HA = new Stave(ctxX, ctxYIteration * 16, ctxWidth / 2);
let staveMeasuresSystem1HB = new Stave(ctxX, ctxYIteration * 17, ctxWidth / 2);
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
    const tuplet1 = new Vex.Tuplet(measureIteration1, { ratioed: false });
    const tuplet2 = new Vex.Tuplet(measureIteration2, { ratioed: false });
    const beam1 = new Beam(measureIteration1);
    const beam2 = new Beam(measureIteration2);

    const notesMeasure2 = measureIteration1.concat(measureIteration2);
    if (i == 0) {
      tuplet2.setTupletLocation(-1);
      const group = context.openGroup();
      measure = staveMeasuresSystem1HA;

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
        staveMeasuresSystem1HA.x,
        staveMeasuresSystem1HA.y,
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
      const group = context.openGroup();
      measure = staveMeasuresSystem1HB;
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
        staveMeasuresSystem1HB.x,
        staveMeasuresSystem1HB.y,
        width + ctxStartX
      );

      measure
        .addClef("treble")
        .addKeySignature(scaleKey)
        .setEndBarType(Vex.Barline.type.REPEAT_END)
        .setContext(context)
        .draw();
    } else if (i < 2) {
      if (i == 1) {
        tuplet1.setTupletLocation(-1);
        tuplet2.setTupletLocation(-1);
      }

      measure = new Stave(measure.width + measure.x, measure.y, width);
      staveMeasuresSystem1HA = measure;

      measure.setContext(context).draw();
    }
    Formatter.FormatAndDraw(context, measure, notesMeasure2);
    tuplet1.setContext(context).draw();
    tuplet2.setContext(context).draw();
    beam1.setContext(context).draw();
    beam2.setContext(context).draw();
  } else if (i == 3) {
    measure = new Stave(measure.width + measure.x, measure.y, width);
    const a = [];
    a.push(eigthNoteSeptuplets[eigthNoteSeptuplets.length - 1]);
    measure.setContext(context).draw();
    Formatter.FormatAndDraw(context, measure, a);
  }
}
