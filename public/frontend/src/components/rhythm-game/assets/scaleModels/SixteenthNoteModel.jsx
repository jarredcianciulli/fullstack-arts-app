import notesObjectGenerator from "../notesObjectGenerator";
import { MyContext } from "./Scales";
import VexFlow from "vexflow";

/// SIXTEENTH NOTE SECTION
function SixteenthNoteModel() {
  const Vex = VexFlow.Flow;

  const { Stave, Beam, Formatter, Renderer } = Vex;

  const {
    keyName,
    keyInfo,
    ctxWidth,
    ctxX,
    ctxYIteration,
    ctxHeight,
    scaleX,
    scaleY,
  } = useContext(MyContext);

  // Create an SVG renderer and attach it to the DIV element with id="output".
  const div = document.getElementById("output");
  const renderer = new Renderer(div, Renderer.Backends.SVG);
  // Configure the rendering context.
  renderer.resize((ctxWidth + ctxX + ctxX) * scaleX, ctxHeight * scaleY);
  const context = renderer.getContext().scale(scaleX, scaleY);
  let scaleKeyLetter = "d";
  let scaleKey = "D";

  let sixteenthNotes = [];
  let sixteenthNotesTest = [];

  notesObjectGenerator(
    scaleKeyLetter,
    "16",
    8,
    0,
    sixteenthNotes,
    sixteenthNotesTest
  );
  console.log(sixteenthNotes);

  let staveMeasuresSystem1IA = new Stave(
    ctxX,
    ctxYIteration * 18,
    ctxWidth / 2
  );
  let staveMeasuresSystem1IB = new Stave(
    ctxX,
    ctxYIteration * 19,
    ctxWidth / 2
  );
  for (let i = 0; i < 4; i++) {
    let measureIteration1 = [];
    let measureIteration2 = [];
    let measureIteration3 = [];
    let measureIteration4 = [];

    if (i < 3) {
      let arrayIteration = i * 16;
      measureIteration1.push(
        sixteenthNotes[0 + arrayIteration],
        sixteenthNotes[1 + arrayIteration],
        sixteenthNotes[2 + arrayIteration],
        sixteenthNotes[3 + arrayIteration]
      );
      measureIteration2.push(
        sixteenthNotes[4 + arrayIteration],
        sixteenthNotes[5 + arrayIteration],
        sixteenthNotes[6 + arrayIteration],
        sixteenthNotes[7 + arrayIteration]
      );
      measureIteration3.push(
        sixteenthNotes[8 + arrayIteration],
        sixteenthNotes[9 + arrayIteration],
        sixteenthNotes[10 + arrayIteration],
        sixteenthNotes[11 + arrayIteration]
      );
      measureIteration4.push(
        sixteenthNotes[12 + arrayIteration],
        sixteenthNotes[13 + arrayIteration],
        sixteenthNotes[14 + arrayIteration],
        sixteenthNotes[15 + arrayIteration]
      );
      const beam1 = new Beam(measureIteration1);
      const beam2 = new Beam(measureIteration2);
      const beam3 = new Beam(measureIteration3);
      const beam4 = new Beam(measureIteration4);

      const notesMeasure2 = measureIteration1
        .concat(measureIteration2)
        .concat(measureIteration3)
        .concat(measureIteration4);
      if (i == 0) {
        const group = context.openGroup();
        measure = staveMeasuresSystem1IA;

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
          staveMeasuresSystem1IA.x,
          staveMeasuresSystem1IA.y,
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
        const group = context.openGroup();
        measure = staveMeasuresSystem1IB;

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
          staveMeasuresSystem1IB.x,
          staveMeasuresSystem1IB.y,
          width + ctxStartX
        );
        measure
          .addClef("treble")
          .addKeySignature(scaleKey)
          .setEndBarType(Vex.Barline.type.REPEAT_END)
          .setContext(context)
          .draw();
      } else if (i < 2) {
        measure = new Stave(measure.width + measure.x, measure.y, width);
        staveMeasuresSystem1IA = measure;

        measure.setContext(context).draw();
      } else {
        measure = new Stave(measure.width + measure.x, measure.y, width);
        staveMeasuresSystem1IB = measure;

        measure.setContext(context).draw();
      }
      Formatter.FormatAndDraw(context, measure, notesMeasure2);
      beam1.setContext(context).draw();
      beam2.setContext(context).draw();
      beam3.setContext(context).draw();
      beam4.setContext(context).draw();
    } else if (i == 3) {
      measure = new Stave(measure.width + measure.x, measure.y, width);
      const a = [];
      a.push(sixteenthNotes[sixteenthNotes.length - 1]);
      measure.setContext(context).draw();
      Formatter.FormatAndDraw(context, measure, a);
    }
  }
  return (
    <>
      <div id="output" className={classes.music_output}></div>
    </>
  );
}

export default SixteenthNoteModel;
