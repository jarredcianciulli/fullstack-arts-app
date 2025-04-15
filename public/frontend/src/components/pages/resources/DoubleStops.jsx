import classes from "./DoubleStops.module.css";
import VexFlow, { TickContext } from "vexflow";

import React, { useRef, useEffect } from "react";

const VF = VexFlow.Flow;

function DoubleStopsPage() {
  useEffect(() => {
    const div = document.getElementById("output2");
    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
    renderer.resize(500, 500);

    const stave = new VF.Stave(10, 40, 400);
    const stave1 = new VF.Stave(-50, 40, 200);
    stave.addClef("treble").addTimeSignature("4/4");

    const voice = new VF.Voice(VF.TIME4_4).addTickables([
      new VF.StaveNote({ keys: ["f/4"], duration: "2" }),
      new VF.StaveNote({ keys: ["f/4"], duration: "2" }),
    ]);

    const formatter = new VF.Formatter({ softmaxFactor: 5 });
    formatter.joinVoices([voice]).formatToStave([voice], stave1);

    voice.draw(renderer.getContext(), stave);
    stave.setContext(renderer.getContext()).draw();
  }, []);
  return <div id="output2" className={classes.music_output}></div>;
}

export default DoubleStopsPage;
