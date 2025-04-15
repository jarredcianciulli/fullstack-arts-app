///ARGPEEGIO SYSTEM
function arpNotesObjectGenerator2(
  key,
  durationValue,
  sequence,
  fingeringScheme,
  clef
) {
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
    if (i == 2) {
      return 0;
    } else if (i == 3) {
      return 1;
    } else if (i == 4) {
      return 2;
    } else if (i == 5) {
      return 3;
    } else if (i == 6) {
      return 4;
    } else {
      return i + 5;
    }
  }
  const notesLoop = ["a", "b", "c", "d", "e", "f", "g"];

  let currentArpeggioOctave;
  let arpeggioIndex;
  let ArpKeyValue;
  arpeggioIndex = notesLoop.indexOf(key);
  currentArpeggioOctave = 3;
  ArpKeyValue = key + "/" + currentArpeggioOctave.toString();
  let rootPosition_3 = handleRootPosition_3(arpeggioIndex);
  let rootPosition_6 = handleRootPosition_6(arpeggioIndex);
  rootPosition_3 = notesLoop[rootPosition_3];
  rootPosition_6 = notesLoop[rootPosition_6];
  for (let i = 0; i < 10; i++) {
    if (i == 3 || i == 6 || i == 9) {
      ArpKeyValue = key + "/" + currentArpeggioOctave;
    } else if (i != 0) {
      if (i == 1 || i == 4 || i == 7) {
        if (rootPosition_3 == "c" || rootPosition_3 == "d") {
          ArpKeyValue =
            rootPosition_3 + "/" + (currentArpeggioOctave + 1).toString();
        } else {
          ArpKeyValue = rootPosition_3 + "/" + currentArpeggioOctave.toString();
        }
      } else {
        if (
          rootPosition_6 == "c" ||
          rootPosition_6 == "d" ||
          rootPosition_6 == "e" ||
          rootPosition_6 == "f" ||
          rootPosition_6 == "g"
        ) {
          ArpKeyValue =
            rootPosition_6 + "/" + (currentArpeggioOctave + 1).toString();
        } else {
          ArpKeyValue = rootPosition_6 + "/" + currentArpeggioOctave.toString();
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
    if (i == 2 || i == 5 || i == 8) {
      currentArpeggioOctave++;
    }
  }
  let arpMajorRootPosNotesTemplate = [];
  arpMajorRootPosNotesTemplate = arpMajorRootPosNotesTemplate.concat(
    ArpeggioNotesArrayMajor.slice(0, 10),
    ArpeggioNotesArrayMajor.reverse().slice(1, 9)
  );
  let newArpArray;
  if (key == "a" || key == "b") {
    newArpArray = arpMajorRootPosNotesTemplate.map((e, i) => {
      if (i >= 3 && i <= 14) {
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
      if (i >= 6 && i <= 14) {
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

export default arpNotesObjectGenerator2;
