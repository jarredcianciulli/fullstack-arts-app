/// EIGHTH NOTE DUPLET SECTION

let eigthNoteDuplets = [];
let eigthNoteDupletsTest = [];

notesObject(scaleKeyLetter, "8", 4, 0, eigthNoteDuplets, eigthNoteDupletsTest);

let staveMeasuresSystem1EA = new Stave(ctxX, ctxYIteration * 10, ctxWidth / 3);
let staveMeasuresSystem1EB = new Stave(ctxX, ctxYIteration * 11, ctxWidth / 4);
let width;
let ctxStartX;
let measure;
for (let i = 0; i < 7; i++) {
  let measureIteration1 = [];
  let measureIteration2 = [];

  if (i < 6) {
    let arrayIteration = i * 8;
    measureIteration1.push(
      eigthNoteDuplets[0 + arrayIteration],
      eigthNoteDuplets[1 + arrayIteration],
      eigthNoteDuplets[2 + arrayIteration],
      eigthNoteDuplets[3 + arrayIteration]
    );
    measureIteration2.push(
      eigthNoteDuplets[4 + arrayIteration],
      eigthNoteDuplets[5 + arrayIteration],
      eigthNoteDuplets[6 + arrayIteration],
      eigthNoteDuplets[7 + arrayIteration]
    );
    const beam1 = new Beam(measureIteration1);
    const beam2 = new Beam(measureIteration2);

    const notesMeasure2 = measureIteration1.concat(measureIteration2);
    if (i == 0) {
      measure = new Stave(
        staveMeasuresSystem1EA.x,
        staveMeasuresSystem1EA.y,
        staveMeasuresSystem1EA.width
      );
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
        staveMeasuresSystem1EA.x,
        staveMeasuresSystem1EA.y,
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
      measure = staveMeasuresSystem1EB;
      const group = context.openGroup();
      measure
        .addClef("treble")
        .addKeySignature(scaleKey)
        .setContext(context)
        .draw();
      context.closeGroup();
      ctxStartX = measure.start_x;
      width = (ctxWidth - ctxStartX) / 4;
      context.svg.removeChild(group);
      measure = new Stave(
        staveMeasuresSystem1EB.x,
        staveMeasuresSystem1EB.y,
        width + ctxStartX
      );
      measure
        .addClef("treble")
        .addKeySignature(scaleKey)
        .setContext(context)
        .draw();
    } else if (i == 5) {
      measure = new Stave(measure.width + measure.x, measure.y, width);
      staveMeasuresSystem1EB = measure;

      measure
        .setEndBarType(Vex.Barline.type.REPEAT_END)
        .setContext(context)
        .draw();
    } else if (i < 3 && i != 0) {
      console.log(width, i);
      measure = new Stave(
        measure.width + measure.x,
        staveMeasuresSystem1EA.y,
        width
      );
      staveMeasuresSystem1EA = measure;
      measure.setContext(context).draw();
    } else {
      measure = new Stave(measure.width + measure.x, measure.y, width);
      staveMeasuresSystem1EB = measure;

      measure.setContext(context).draw();
    }
    Formatter.FormatAndDraw(context, measure, notesMeasure2);

    beam1.setContext(context).draw();
    beam2.setContext(context).draw();
  } else if (i == 6) {
    measure = new Stave(measure.width + measure.x, measure.y, width);
    const a = [];
    a.push(eigthNoteDuplets[eigthNoteDuplets.length - 1]);
    measure.setContext(context).draw();
    Formatter.FormatAndDraw(context, measure, a);
  }
}
