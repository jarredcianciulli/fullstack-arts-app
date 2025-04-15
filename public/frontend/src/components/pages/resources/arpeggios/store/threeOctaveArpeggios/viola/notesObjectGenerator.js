function notesObjectGenerator(
  key,
  durationValue,
  sequence,
  fingeringScheme,
  clef
) {
  clef = "alto";
  let testNotesArray = [];
  function addIndex(i) {
    if (i < 6) {
      return i + 1;
    } else {
      return (i = 0);
    }
  }

  function subtractIndex(i) {
    if (i == 0) {
      return 6;
    } else {
      return i - 1;
    }
  }

  const notesLoop = ["a", "b", "c", "d", "e", "f", "g"];
  let currentOctave;
  let index;
  let keyValue;
  index = notesLoop.indexOf(key);

  currentOctave = 3;
  keyValue = key + "/" + currentOctave.toString();
  for (let i = 0; i < 44; i++) {
    if (
      ((i == 8 || i == 9) && sequence == 5 && key == "a") ||
      (i == 7 &&
        sequence == 4 &&
        (key == "g" || key == "a" || key == "b" || key == "c")) ||
      ((i == 7 || i == 8 || i == 9) && sequence == 5 && key == "e") ||
      ((i == 8 || i == 9) &&
        sequence == 5 &&
        (key == "g" || key == "a" || key == "b" || key == "c")) ||
      ((i == 34 || i == 35) && sequence == 8 && key == "b") ||
      ((i == 37 || i == 38) && sequence == 8 && key == "e") ||
      ((i == 5 || i == 6 || i == 7) && sequence == 4 && key == "d") ||
      ((i == 34 || i == 35 || i == 36 || i == 37) &&
        sequence == 4 &&
        key == "d") ||
      (i == 7 && sequence == 8 && key != "e" && key != "f") ||
      ((i == 6 || i == 7) && key == "c" && sequence != 6 && sequence != 7) ||
      (i == 6 && key == "c" && sequence == 7) ||
      ((i == 34 || i == 35 || i == 36) && sequence == 4 && key == "c") ||
      (i == 37 && sequence == 5 && key == "d") ||
      (i == 5 && sequence == 6 && key == "d") ||
      ((i == 5 || i == 6) && sequence == 7 && key == "d") ||
      ((i == 5 || i == 6 || i == 37) && sequence == 8 && key == "d") ||
      ((i == 35 || i == 36 || i == 37 || i == 38) &&
        sequence == 7 &&
        key == "d") ||
      ((i == 38 || i == 37) && sequence == 4 && key == "e") ||
      (i == 4 && sequence == 5 && key == "e") ||
      ((i == 37 || i == 38) && sequence == 5 && key == "e") ||
      ((i == 4 || i == 5) && sequence == 6 && key == "e") ||
      ((i == 4 || i == 5 || i == 6) && sequence == 7 && key == "e") ||
      (i == 3 && sequence == 4 && key == "f") ||
      ((i == 37 || i == 38 || i == 39) && sequence == 4 && key == "f") ||
      ((i == 3 || i == 4 || i == 37 || i == 39 || i == 38) &&
        sequence == 5 &&
        key == "f") ||
      ((i == 3 || i == 4 || i == 5 || i == 39) &&
        sequence == 6 &&
        key == "f") ||
      ((i == 3 || i == 4 || i == 5 || i == 6) && sequence == 7 && key == "f") ||
      ((i == 3 ||
        i == 34 ||
        i == 35 ||
        i == 36 ||
        i == 37 ||
        i == 38 ||
        i == 39 ||
        i == 40 ||
        i == 41) &&
        sequence == 8 &&
        key == "f")
    ) {
      testNotesArray.push({
        keys: [keyValue],
        stem_direction: 1,
        clef: clef,
        duration: durationValue,
      });
    } else if (
      ((i == 8 ||
        i == 9 ||
        i == 10 ||
        i == 11 ||
        i == 12 ||
        i == 13 ||
        i == 36 ||
        i == 37 ||
        i == 38 ||
        i == 39 ||
        i == 40 ||
        i == 41 ||
        i == 42) &&
        sequence == 7 &&
        key == "b") ||
      ((i == 6 || i == 7 || i == 8 || i == 9 || i == 10 || i == 11) &&
        sequence == 6 &&
        (key == "g" || key == "a" || key == "b" || key == "c")) ||
      ((i == 7 ||
        i == 8 ||
        i == 9 ||
        i == 10 ||
        i == 11 ||
        i == 12 ||
        i == 13) &&
        sequence == 7 &&
        (key == "g" || key == "a" || key == "b" || key == "c")) ||
      (i == 33 && (key == "d" || key == "e" || key == "c") && sequence != 4) ||
      ((i == 37 || i == 38) && key == "c" && sequence == 6) ||
      ((i == 37 || i == 38 || i == 39 || i == 40 || i == 41) &&
        (key == "c" || key == "e") &&
        sequence == 7) ||
      ((i == 8 || i == 9 || i == 10 || i == 11) &&
        sequence == 6 &&
        key == "d") ||
      (i == 38 && sequence == 6 && key == "d") ||
      (i == 33 && sequence == 4 && key == "e") ||
      (i == 33 && sequence == 1 && key == "f") ||
      ((i == 7 || i == 8 || i == 9) && sequence == 5 && key == "e") ||
      ((i == 10 || i == 11 || i == 12 || i == 13 || i == 14) &&
        sequence == 5 &&
        key == "g") ||
      ((i == 8 || i == 9 || i == 10 || i == 11) &&
        sequence == 6 &&
        key == "e") ||
      ((i == 8 || i == 9 || i == 10 || i == 11 || i == 12 || i == 13) &&
        sequence == 7 &&
        (key == "d" || key == "e")) ||
      (i == 33 && sequence == 4 && key == "f") ||
      ((i == 35 || i == 36 || i == 37) && sequence == 5 && key == "f") ||
      ((i == 3 ||
        i == 4 ||
        i == 5 ||
        i == 8 ||
        i == 9 ||
        i == 10 ||
        i == 11 ||
        i == 33) &&
        sequence == 6 &&
        key == "f") ||
      ((i == 8 ||
        i == 9 ||
        i == 10 ||
        i == 11 ||
        i == 12 ||
        i == 13 ||
        i == 40 ||
        i == 41) &&
        sequence == 7 &&
        key == "f") ||
      (i == 7 && sequence == 8 && key == "f") ||
      (i == 33 && sequence == 2 && key == "f")
    ) {
      testNotesArray.push({
        keys: [keyValue],
        stem_direction: -1,
        clef: clef,
        duration: durationValue,
      });
    } else if (i == 7 && sequence == 6 && key == "b") {
      testNotesArray.push({
        keys: [keyValue],
        stem_direction: 1,
        clef: clef,
        duration: durationValue,
      });
    } else if (i == 7 && (sequence == 5 || sequence == 4) && key == "b") {
      testNotesArray.push({
        keys: [keyValue],
        stem_direction: 1,
        clef: clef,

        duration: durationValue,
      });
    } else if (
      ((i == 10 || i == 11) && sequence == 5) ||
      ((i == 8 || i == 9) && sequence == 5 && key == "d")
    ) {
      testNotesArray.push({
        keys: [keyValue],
        stem_direction: -1,
        clef: clef,

        duration: durationValue,
      });
    } else if (
      (i == 34 || i == 35 || i == 36) &&
      (sequence == 4 || sequence == 6) &&
      key == "b"
    ) {
      testNotesArray.push({
        keys: [keyValue],
        stem_direction: 1,
        clef: clef,

        duration: durationValue,
      });
    } else if ((i == 33 || i == 34 || i == 35 || i == 36) && sequence == 5) {
      testNotesArray.push({
        keys: [keyValue],
        stem_direction: -1,
        clef: clef,

        duration: durationValue,
      });
    } else if (i == 34 && key == "a" && sequence != 7) {
      testNotesArray.push({
        keys: [keyValue],
        stem_direction: 1,
        clef: clef,

        duration: durationValue,
      });
    } else if ((i == 8 || i == 9 || i == 10 || i == 11) && sequence == 6) {
      testNotesArray.push({
        keys: [keyValue],
        stem_direction: 1,
        clef: clef,

        duration: durationValue,
      });
    } else if (
      (i == 8 || i == 9 || i == 10 || i == 11 || i == 12 || i == 13) &&
      sequence == 7
    ) {
      testNotesArray.push({
        keys: [keyValue],
        stem_direction: 1,
        clef: clef,

        duration: durationValue,
      });
    } else if ((i == 33 || i == 34) && sequence == 7) {
      testNotesArray.push({
        keys: [keyValue],
        stem_direction: -1,
        clef: clef,

        duration: durationValue,
      });
    } else if (i == 42 && sequence == 7) {
      testNotesArray.push({
        keys: [key + "/" + currentOctave.toString()],
        auto_stem: true,
        clef: clef,
        duration: "w",
      });
    } else if (i != 43 && i != 8 && i != 8 && i != 33) {
      testNotesArray.push({
        keys: [keyValue],
        auto_stem: true,
        clef: clef,

        duration: durationValue,
      });
    } else if (i == 43) {
      if (key == "c") {
        currentOctave++;
      }
      testNotesArray.push({
        keys: [key + "/" + currentOctave.toString()],
        auto_stem: true,
        clef: clef,

        duration: "w",
      });
    } else if (i == 8) {
      testNotesArray.push({
        keys: [keyValue],
        stem_direction: -1,
        clef: clef,

        duration: durationValue,
      });
    } else if (i == 33 && key == "b" && sequence == 1) {
      testNotesArray.push({
        keys: [keyValue],
        stem_direction: -1,
        clef: clef,

        duration: durationValue,
      });
    } else if (i == 33) {
      testNotesArray.push({
        keys: [keyValue],
        stem_direction: 1,
        clef: clef,

        duration: durationValue,
      });
    }
    if (i < 21) {
      if (index == 1) {
        currentOctave++;
      }
      index = addIndex(index);
      keyValue = notesLoop[index] + "/" + currentOctave;
    } else {
      if (index == 2) {
        currentOctave--;
      }
      index = subtractIndex(index);
      keyValue = notesLoop[index] + "/" + currentOctave;
    }
    if (sequence != 7 && i == 20) {
      testNotesArray.slice(18).forEach((e) => {
        testNotesArray.push(e);
      });
    }
    if (i == 41) {
      if (sequence == 5) {
        testNotesArray.push(testNotesArray.slice(44, 45)[0]);
      }
    }
    if (i == 42) {
      if (sequence == 5) {
        testNotesArray.push(testNotesArray.slice(46, 47)[0]);
        testNotesArray.push(testNotesArray.slice(44, 45)[0]);
        testNotesArray.push(testNotesArray.slice(43, 44)[0]);
      } else if (sequence == 7) {
      } else {
        testNotesArray.push(testNotesArray.slice(44, 45)[0]);
        testNotesArray.push(testNotesArray.slice(43, 44)[0]);
      }
    }
  }
  // console.log(testNotesArray);

  ///ARGPEEGIO SYSTEM
  clef = "alto";
  let ArpeggioNotesArrayMajor = [];
  let ArpeggioNotesArrayMinor = [];
  let ArpeggioNotesArrayMajor6 = [];
  let ArpeggioNotesArrayMajor6_4 = [];
  let ArpeggioNotesArrayMinor6_4 = [];
  function handleRootPosition_3(i) {
    if (i == 5) {
      return 0;
    } else if (i == 6) {
      return 1;
    } else {
      return i + 2;
    }
  }
  function handleRootPosition_6(i) {
    if (i == 3) {
      return 0;
    } else if (i == 4) {
      return 1;
    } else if (i == 5) {
      return 2;
    } else if (i == 6) {
      return 3;
    } else {
      return i + 4;
    }
  }

  // const notesLoop = ["a", "b", "c", "d", "e", "f", "g"];
  let currentArpeggioOctave;
  let arpeggioIndex;
  let arpeggioKeyValue;
  let ArpKeyValue;
  arpeggioIndex = notesLoop.indexOf(key);
  currentArpeggioOctave = 3;
  ArpKeyValue = key + "/" + currentArpeggioOctave.toString();
  currentOctave = 3;
  ArpKeyValue = key + "/" + currentOctave.toString();
  let rootPosition_3 = handleRootPosition_3(arpeggioIndex);
  let rootPosition_6 = handleRootPosition_6(arpeggioIndex);
  rootPosition_3 = notesLoop[rootPosition_3];
  rootPosition_6 = notesLoop[rootPosition_6];
  for (let i = 0; i < 10; i++) {
    if (i == 3 || i == 6 || i == 9) {
      currentArpeggioOctave++;
      ArpKeyValue = key + "/" + currentArpeggioOctave;
    } else if (i != 0) {
      if (i == 1 || i == 4 || i == 7) {
        ArpKeyValue = rootPosition_3 + "/" + currentOctave.toString();
      } else {
        ArpKeyValue = rootPosition_6 + "/" + currentOctave.toString();
      }
    } else {
      keyValue = key + "/" + currentArpeggioOctave;
    }
    ArpeggioNotesArrayMajor.push({
      keys: [ArpKeyValue],
      auto_stem: true,
      clef: clef,

      duration: durationValue,
    });
    if (i == 2 || i == 5 || i == 8) {
      currentOctave++;
    }
  }
  // console.log(testNotesArray);
  return testNotesArray;
}

export default notesObjectGenerator;
