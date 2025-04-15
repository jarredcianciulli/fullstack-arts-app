import React, { useRef, useEffect } from "react";
import { ChordBox } from "vexchords";

export function Chord({ chordBoxParams, ...props }) {
  const container = useRef(null);

  useEffect(() => {
    const chord = new ChordBox(container.current, chordBoxParams);
    chord.draw(props);
  }, []);

  return <div ref={container} />;
}
