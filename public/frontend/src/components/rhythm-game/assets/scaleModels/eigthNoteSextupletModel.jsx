/// EIGHTH NOTE SEXTUPLET SECTION

let eigthNoteSextuplets = [];
let eigthNoteSextupletsTest = [];

notesObject(
  scaleKeyLetter,
  "8",
  6,
  0,
  eigthNoteSextuplets,
  eigthNoteSextupletsTest
);

let staveMeasuresSystem1GA = new Stave(ctxX, ctxYIteration * 14, ctxWidth / 2);
let staveMeasuresSystem1GB = new Stave(ctxX, ctxYIteration * 15, ctxWidth / 3);
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
    const tuplet1 = new Vex.Tuplet(measureIteration1, { ratioed: false });
    const tuplet2 = new Vex.Tuplet(measureIteration2, { ratioed: false });
    const beam1 = new Beam(measureIteration1);
    const beam2 = new Beam(measureIteration2);

    const notesMeasure2 = measureIteration1.concat(measureIteration2);
    if (i == 0) {
      tuplet2.setTupletLocation(-1);
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
    measure.setContext(context).draw();
    Formatter.FormatAndDraw(context, measure, a);
  }
}
