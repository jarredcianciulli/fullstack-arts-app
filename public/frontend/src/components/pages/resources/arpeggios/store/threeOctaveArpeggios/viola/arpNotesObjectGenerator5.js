///ARGPEEGIO SYSTEM
function arpNotesObjectGenerator5(
  key,
  durationValue,
  sequence,
  fingeringScheme,
  clef
) {
  clef = "alto";
  let ArpeggioNotesArrayMajor = [];
  function handleRootPosition_3(i) {
    if (i == 5) {
      return 0;
    } else if (i == 6) {
      return 1;
    } else {
      return i + 2;
    }
  }

  function handleRootPosition_4(i) {
    if (i == 4) {
      return 0;
    } else if (i == 5) {
      return 1;
    } else if (i == 6) {
      return 2;
    } else {
      return i + 3;
    }
  }
  function handleRootPosition_5(i) {
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
  function handleRootPosition_7(i) {
    if (i !== 0) {
      return i - 1;
    } else {
      return 6;
    }
  }

  const notesLoop = ["a", "b", "c", "d", "e", "f", "g"];

  let currentArpeggioOctave;
  let arpeggioIndex;
  let ArpKeyValue;
  let lastArpKeyValue;
  arpeggioIndex = notesLoop.indexOf(key);
  let lastNoteArpeggioNoteOctave = 3;
  currentArpeggioOctave = 3;
  ArpKeyValue = key + "/" + currentArpeggioOctave.toString();
  let rootPosition_3 = handleRootPosition_3(arpeggioIndex);
  let rootPosition_4 = handleRootPosition_4(arpeggioIndex);
  let rootPosition_5 = handleRootPosition_5(arpeggioIndex);
  let rootPosition_7 = handleRootPosition_7(arpeggioIndex);
  rootPosition_3 = notesLoop[rootPosition_3];
  rootPosition_4 = notesLoop[rootPosition_4];
  rootPosition_5 = notesLoop[rootPosition_5];
  rootPosition_7 = notesLoop[rootPosition_7];
  for (let i = 0; i < 13; i++) {
    if (i == 4 || i == 8 || i == 12) {
      ArpKeyValue = key + "/" + currentArpeggioOctave;
    } else if (i !== 0) {
      if (i === 1 || i === 5 || i === 9) {
        if (rootPosition_3 == "c" || rootPosition_3 == "d") {
          ArpKeyValue =
            rootPosition_3 + "/" + (currentArpeggioOctave + 1).toString();
        } else {
          ArpKeyValue = rootPosition_3 + "/" + currentArpeggioOctave.toString();
        }
      } else if (i === 10 || i === 2 || i === 6) {
        if (
          rootPosition_5 == "c" ||
          rootPosition_5 == "d" ||
          rootPosition_5 == "e" ||
          rootPosition_5 == "f"
        ) {
          ArpKeyValue =
            rootPosition_5 + "/" + (currentArpeggioOctave + 1).toString();
        } else {
          ArpKeyValue = rootPosition_5 + "/" + currentArpeggioOctave.toString();
        }
      } else {
        if (
          rootPosition_7 == "c" ||
          rootPosition_7 == "d" ||
          rootPosition_7 == "e" ||
          rootPosition_7 == "f" ||
          rootPosition_7 == "g" ||
          rootPosition_7 == "a"
        ) {
          ArpKeyValue =
            rootPosition_7 + "/" + (currentArpeggioOctave + 1).toString();
        } else {
          ArpKeyValue = rootPosition_7 + "/" + currentArpeggioOctave.toString();
        }
      }
    } else {
      ArpKeyValue = key + "/" + currentArpeggioOctave;
    }
    ArpeggioNotesArrayMajor.push({
      keys: [ArpKeyValue],
      clef: clef,
      //   auto_stem: true,
      duration: durationValue,
      //   glyph_font_scale: 50,
    });

    if (i == 3 || i == 7 || i == 11) {
      currentArpeggioOctave++;
    }
  }
  let arpMajorRootPosNotesTemplate = [];
  arpMajorRootPosNotesTemplate = arpMajorRootPosNotesTemplate.concat(
    ArpeggioNotesArrayMajor.slice(0, 13),
    ArpeggioNotesArrayMajor.reverse().slice(1, 12)
  );
  if (rootPosition_4 == "c" || rootPosition_4 == "d" || rootPosition_4 == "e") {
    lastArpKeyValue =
      rootPosition_4 + "/" + (lastNoteArpeggioNoteOctave + 1).toString();
  } else {
    lastArpKeyValue =
      rootPosition_4 + "/" + lastNoteArpeggioNoteOctave.toString();
  }
  arpMajorRootPosNotesTemplate.push({
    keys: [lastArpKeyValue],
    clef: clef,
    //   auto_stem: true,
    duration: "h",
    //   glyph_font_scale: 50,
  });
  let newArpArray;
  if (key == "a" || key == "b") {
    newArpArray = arpMajorRootPosNotesTemplate.map((e, i) => {
      if (i >= 4 && i <= 19) {
        return {
          ...e,
          clef: "treble",
        };
      } else {
        return e;
      }
    });
  } else {
    newArpArray = arpMajorRootPosNotesTemplate.map((e, i) => {
      if (i >= 8 && i <= 15) {
        return {
          ...e,
          clef: "treble",
        };
      } else {
        return e;
      }
    });
  }

  return newArpArray;
}

export default arpNotesObjectGenerator5;
