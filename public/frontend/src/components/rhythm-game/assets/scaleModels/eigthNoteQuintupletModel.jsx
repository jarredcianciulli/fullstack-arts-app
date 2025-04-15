/// EIGHTH NOTE QUINTUPLET SECTION

let eigthNoteQuintuplets = [];
let eigthNoteQuintupletsTest = [];

notesObject(
  scaleKeyLetter,
  "8",
  5,
  0,
  eigthNoteQuintuplets,
  eigthNoteQuintupletsTest
);

let staveMeasuresSystem1FA = new Stave(ctxX, ctxYIteration * 12, ctxWidth / 3);
let staveMeasuresSystem1FB = new Stave(ctxX, ctxYIteration * 13, ctxWidth / 3);

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
    const tuplet1 = new Vex.Tuplet(measureIteration1, { ratioed: false });
    const tuplet2 = new Vex.Tuplet(measureIteration2, { ratioed: false });
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
    measure.setContext(context).draw();
    Formatter.FormatAndDraw(context, measure, a);
  }
}
