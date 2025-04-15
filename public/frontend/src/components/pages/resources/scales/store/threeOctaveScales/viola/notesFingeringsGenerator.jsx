import React, { useContext } from "react";
const { StaveNote } = Vex;

const Vex = VexFlow.Flow;

function ScalesViolinFingerings() {
  const { StaveNote } = Vex;

  ///useContext to get testNotesArray and allNotesArray

  /// FINGERINGS SECTION
  testNotesArray.forEach((e, i) => {
    if (i == 11 || i == 17) {
      allNotesArray.push(new StaveNote(e).addModifier(new Vex.Annotation("1")));
    } else if (
      ((i == 23 || i == 24 || i == 25) && sequence != 7) ||
      ((i == 20 || i == 21 || i == 22) && sequence == 7)
    ) {
      allNotesArray.push(new StaveNote(e).addModifier(new Vex.Annotation("4")));
    } else if (
      ((i == 29 || i == 35) && sequence != 7) ||
      ((i == 26 || i == 32) && sequence == 7)
    ) {
      allNotesArray.push(new StaveNote(e).addModifier(new Vex.Annotation("2")));
    } else {
      allNotesArray.push(new StaveNote(e));
    }
  });
}

export default ScalesViolinFingerings;
