import React, { useRef, useEffect } from "react";
import VexFlow from "vexflow";
import classes from "./react-vexflow.module.css";
const VF = VexFlow.Flow;
const { Formatter, Renderer, Stave, StaveNote } = VF;

const clefAndTimeWidth = 60;

export function Score({
  staves = [],
  clef = "treble",
  timeSignature = "4/4",
  keySignature = null,
  width = 550,
  height = 125,
}) {
  const container = useRef();
  const rendererRef = useRef();

  useEffect(() => {
    if (rendererRef.current == null) {
      rendererRef.current = new Renderer(
        container.current,
        Renderer.Backends.SVG
      );
    }
    const renderer = rendererRef.current;
    renderer.resize(width, height);
    const context = renderer.getContext();
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
    const staveWidth = (width - clefAndTimeWidth) / staves.length;

    let currX = 0;
    staves.forEach((notes, i) => {
      const stave = new Stave(currX, 0, staveWidth);
      if (i === 0) {
        stave.setWidth(staveWidth + clefAndTimeWidth);
        stave.addClef(clef).addTimeSignature(timeSignature);
        if (keySignature) {
          stave.addKeySignature(keySignature);
        }
      }
      currX += stave.getWidth();
      stave.setContext(context).draw();

      const processedNotes = notes
        .map((note) => (typeof note === "string" ? { key: note } : note))
        .map((note) =>
          Array.isArray(note) ? { key: note[0], duration: note[1] } : note
        )
        .map(({ key, ...rest }) =>
          typeof key === "string"
            ? {
                key: key.includes("/") ? key : `${key[0]}/${key.slice(1)}`,
                ...rest,
              }
            : rest
        )
        .map(
          ({ key, keys, duration = "d" }) =>
            new StaveNote({
              keys: key ? [key] : keys,
              duration: String(duration),
            })
        );
      Formatter.FormatAndDraw(context, stave, processedNotes, {
        auto_beam: true,
      });
    });
  }, [staves]);

  return <div className={classes.musicExercise} ref={container} />;
}
