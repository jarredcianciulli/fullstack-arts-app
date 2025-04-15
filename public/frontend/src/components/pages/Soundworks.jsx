import { useState, createContext } from "react";
import classes from "./Home.module.css";

import ResumeHeader from "./assets/resume_header_line.svg";
import PDFIcon from "./assets/icon_pdf.svg";
import WordIcon from "./assets/icon_word.svg";
import TreAmici1 from "./img/projects/tre_amici_1.png";
import MusiWork1 from "./img/projects/musiwork_1.png";
import RESUME_PDF from "./assets/Jarred-2023-Resume.pdf";
import RESUME_DOC from "./assets/Jarred-2023-Resume.docx";
import RhythmGame from "../rhythm-game/RhythmGame";
import { Score } from "../music-exercise/react-vexflow";
import { Vex, Stave, StaveNote, Formatter } from "vexflow";
import React, { useRef, useEffect } from "react";

import Canvas from "../music-exercise/Canvas";

// Create an SVG renderer and attach it to the DIV element named "boo".

export const FormContext = createContext();

function HomePage() {
  const [showHomeForm, setShowHomeForm] = useState(false);
  const [showContactFormTextValid, setShowContactFormTextValid] =
    useState(false);
  const [showContactFormInputEmailValid, setShowContactFormInputEmailValid] =
    useState(false);
  const [showContactFormInputNameValid, setShowContactFormInputNameValid] =
    useState(false);
  const [showSendStatus, setShowSendStatus] = useState("Send");
  const [showContactName, setShowContactName] = useState("");
  const [showContactEmail, setShowContactEmail] = useState("");
  const [showContactText, setShowContactText] = useState("");

  function downloadFileAtURL(url) {
    const fileName = url.split("/").pop();
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  }

  function sendContactForm(event) {
    event.preventDefault();
    if (showContactName.split("").length < 3) {
      setShowContactFormInputNameValid(true);
    }
    if (!showContactEmail.includes("@")) {
      setShowContactFormInputEmailValid(true);
    }
    if (showContactText.split("").length < 10) {
      setShowContactFormTextValid(true);
    }
    setShowSendStatus("Submitting...");
    setShowSendStatus("Submitted");
  }
  // const canvasRef = useRef(null);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext("2d");
  //   console.log("sf");

  //   //Our first draw
  //   // context.fillStyle = "#000000";
  //   // context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  //   const vexflow = () => {
  //     const VF = Vex.Flow;
  //     Vex.Flow.setMusicFont("Petaluma");
  //     const { Factory, EasyScore, System } = Vex.Flow;

  //     const vf = new Factory({
  //       renderer: { elementId: "canvas", width: 500, height: 200 },
  //     });

  //     const score = vf.EasyScore();
  //     const system = vf.System();

  //     system
  //       .addStave({
  //         voices: [
  //           score.voice(score.notes("C#5/q, B4, A4, G#4", { stem: "up" })),
  //           // score.voice(score.notes("C#4/h, C#4", { stem: "down" }))
  //         ],
  //       })
  //       .addClef("treble")
  //       .addTimeSignature("4/4");

  //     vf.draw();
  //   };
  //   vexflow();
  // }, []);

  const canvasRef2 = useRef(null);
  const colorScheme = {
    fillStyle: "#604f05ff",
    strokeStyle: "#604f05ff",
    color: "#604f05ff",
  };
  useEffect(() => {
    console.log(canvasRef2.current);
    // const tabDOM = document.getElementById("canvas2");
    const canvas2 = canvasRef2.current;
    const vexflow = () => {
      const {
        Stave,
        StaveNote,
        Beam,
        Formatter,
        Renderer,
        addDotToAll,
        getIntrinsicTicks,
      } = Vex.Flow;

      // Create an SVG renderer and attach it to the DIV element with id="output".
      const renderer = new Renderer(canvas2, Renderer.Backends.SVG);

      // Configure the rendering context.
      renderer.resize(620, 130);
      const context2 = renderer.getContext();

      // Measure 1
      const staveMeasure1 = new Stave(10, 0, 300);
      staveMeasure1
        .setStyle(colorScheme)
        .addClef("percussion")
        .addTimeSignature("4/4")
        .setContext(context2)
        .drawWithStyle();

      const notesMeasure1 = [
        new StaveNote({ keys: ["c/5"], duration: "q" }).addModifier(
          new Vex.Flow.Dot()
        ),
        new StaveNote({ keys: ["c/5"], duration: "8" }),
        new StaveNote({ keys: ["c/5"], duration: "q" }),
        new StaveNote({ keys: ["c/5"], duration: "q" }),
      ];
      notesMeasure1.forEach((e) => e.setGroupStyle(colorScheme));
      // Helper function to justify and draw a 4/4 voice
      Formatter.FormatAndDraw(context2, staveMeasure1, notesMeasure1);

      // Measure 2 - second measure is placed adjacent to first measure.
      const staveMeasure2 = new Stave(
        staveMeasure1.width + staveMeasure1.x,
        0,
        300
      ).setStyle(colorScheme);

      const notesMeasure2_part1 = [
        new StaveNote({ keys: ["c/5"], duration: "8" }),
        new StaveNote({ keys: ["c/5"], duration: "8" }),
        new StaveNote({ keys: ["c/5"], duration: "8" }),
        new StaveNote({ keys: ["c/5"], duration: "8" }),
      ];

      const notesMeasure2_part2 = [
        new StaveNote({ keys: ["c/5"], duration: "8" }),
        new StaveNote({ keys: ["c/5"], duration: "8" }),
        new StaveNote({ keys: ["c/5"], duration: "8" }),
        new StaveNote({ keys: ["c/5"], duration: "8" }),
      ];
      notesMeasure2_part1.forEach((e) => e.setStyle(colorScheme));
      notesMeasure2_part2.forEach((e) => e.setStyle(colorScheme));

      // Create the beams for 8th notes in second measure.
      const beam1 = new Beam(notesMeasure2_part1).setStyle(colorScheme);
      const beam2 = new Beam(notesMeasure2_part2).setStyle(colorScheme);

      const notesMeasure2 = notesMeasure2_part1.concat(notesMeasure2_part2);

      staveMeasure2.setContext(context2).drawWithStyle();
      Formatter.FormatAndDraw(context2, staveMeasure2, notesMeasure2);

      // Render beams
      beam1.setContext(context2).drawWithStyle();
      beam2.setContext(context2).drawWithStyle();
    };
    vexflow();
  }, [canvasRef2]);

  return (
    <>
      <div className={classes.header_section}>
        <div className={classes.header_sectionContainer}>
          <RhythmGame />
          {/*<Score
            clef="percussion"
            staves={[
              [
                {
                  keys: ["c/5"],
                  duration: "4",
                  stem_direction: -1,
                },
                {
                  keys: ["c/5"],
                  duration: "8",
                  stem_direction: -1,
                },
                {
                  keys: ["c/5"],
                  duration: "8",
                  stem_direction: -1,
                },
                {
                  keys: ["c/5"],
                  duration: "4",
                  stem_direction: -1,
                },
                {
                  keys: ["c/5"],
                  duration: "4",
                  stem_direction: -1,
                },
              ],
            ]}
          /> */}
          <div
            className={classes.header_sectionMusicContainer}
            ref={canvasRef2}
          ></div>
        </div>
        {/* <canvas id="canvas" ref={canvasRef}></canvas> */}
      </div>
    </>
  );
}

export default HomePage;
