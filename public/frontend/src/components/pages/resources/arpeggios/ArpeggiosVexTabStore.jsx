import React, { useRef, useEffect, useContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import classes from "./Scales.module.css";
import { MyContext } from "./ScalesOptions";
import ArrrowDown from "../assets/subscription_arrow_down_icon.svg";

export function Tab({ id, key_signature, instrument }) {
  //context for current key signature
  const { keyName, keySignature, keyInfo } = useContext(MyContext);

  //render canvas for music notation
  let vextabCanvas;
  const { Vex, VexTab, Artist } = window.vextab;
  Artist.NOLOGO = true;
  const Renderer = Vex.Flow.Renderer;
  const container = useRef(null);
  const container2 = useContext(MyContext);

  //music notation variables for canvas

  let TabStaveOptions = `options stave-distance=100 space=20`;
  let TabStaveHeaderText = `text :q,.-1,Start down bow and up bow`;

  let AflatMajorNotesScaleUp = `notes A/3 $.am/top.$
      notes B/3-C-D-E-F-G-A-B/4-C-D-E-F-G-A-B/5-C-D-E-F-G-E-F-G/6`;

  let AflatMajorNotesScaleDown = `notes :q A-G-F-E-D-C/6-B-A-G-F-E-D-C/5-B-A-G-F-E-D-C/4-B-A-G-B-A/3=|=`;

  let FirstFingerScalesTextUp = `text :q, , , , , , , , , , .1, 1, , , , , , , .-2, 1`;
  let SecondFingerScalesTextUp = `text ++,.2,2, , , , , , , , ,.1, 3, .1, 1, , , , , , .-2, 3, .-2, 1`;

  let FirstFingerScalesTextDown = `text :q,.-3,4,.-2,4, , , ,.0,2, , , , , , .2, 3`;
  let SecondFingerScalesTextDown = `text :q,.-4,4,.-4,4, , ,.-3, 1,.-2,3, , , , , ,.0,1, .1, 3`;
  let scalesNotes = ["A", "B", "C", "D", "E", "F", "G"];
  let scalee = "";
  let scaleVariableUp = "";
  let scaleVariableDown = "";
  let scaleOctave = "";
  let scaleOctave2 = 3;
  AflatMajorNotesScaleUp.split("notes")[2]
    .split("-")
    .forEach((e, i) => {
      const notationLength = AflatMajorNotesScaleUp.split("-").length;
      const matchedIndex = scalesNotes.indexOf(e);
      const matchedIndexSlash = scalesNotes.indexOf(
        e.split("/")[0].split(" ").join("")
      );
      if (e.includes("/")) {
        scaleOctave = parseInt(e.split("/")[1]) + 1;
        if (i == notationLength - 1) {
          if (scalesNotes[matchedIndexSlash] == scalesNotes[6]) {
            scalee += scalesNotes[0] + "/" + (scaleOctave - 1);
          } else {
            scalee += scalesNotes[matchedIndexSlash + 1];
          }
        } else {
          scalee += scalesNotes[matchedIndexSlash + 1] + "-";
        }
      } else {
        if (matchedIndex == 6) {
          scalee += scalesNotes[0] + "-";
        } else {
          if (e == "A") {
            if (i == notationLength - 1) {
              scalee += scalesNotes[matchedIndex + 1] + "/" + scaleOctave;
            } else {
              scalee += scalesNotes[matchedIndex + 1] + "/" + scaleOctave + "-";
            }
          } else {
            if (i == notationLength - 1) {
              scalee += scalesNotes[matchedIndex + 1];
            } else {
              scalee += scalesNotes[matchedIndex + 1] + "-";
            }
          }
        }
      }
    });

  //create notation based on context and music notation variables
  useEffect(() => {
    let TabStaveText = `tabstave clef=treble notation=true tablature=false key=${keyName}`;
    if (keyInfo === "G Major" || keyName === null) {
      vextabCanvas = `
      options stave-distance=50 space=20 scale=.6 width=1200
      tabstave clef=treble notation=true tablature=false key=G time=4/4
      text :h,.-1,Start up bow and down bow
      text :h $.am/top.$
      notes :h =|: G/3-A/3 | B/3-C/4 | D/4-E/4 | F-G/4 | A-B/4 | C-D/5 $.top.$ $1$
      
      tabstave clef=treble notation=true tablature=false key=G
      notes :h E/5-F/5 | G-A/5 | B/5-C/6 $.top.$ $1$ | D-E/6 | F-D/6 | E-F/6

      tabstave clef=treble notation=true tablature=false key=G
      notes :h G/6 $.top.$ $4$ -F/6 $.top.$ $4$ | E-D/6 | C/6-B/5 $.top.$ $2$ | A-G/5 | F-E/5 | D-C/5 $.top.$ $2$

      tabstave clef=treble notation=true tablature=false key=G
      notes :h B/4-A/4 | G-F/4 | E-D/4 | C/4-B/3 | A-G/3 | A-B/3 =:| :w G/3=|=

        

      options stave-distance=50 space=20
      tabstave clef=treble notation=true tablature=false key=G time=4/4
      text :q,.-1,Start up bow and down bow
      text :q $.am/top.$
      notes :q =|: G/3-A/3-B/3-C/4 | D/4-E/4-F-G/4 | A-B/4-C-D/5 $.top.$ $1$ | E/5-F/5-G-A/5
 
      
      tabstave clef=treble notation=true tablature=false key=G
      notes :q B/5-C/6 $.top.$ $1$ -D-E/6 | F-D/6-E-F/6 | G/6 $.top.$ $4$ -F/6 $.top.$ $4$ -E-D/6 | C/6-B/5 $.top.$ $2$ -A-G/5

      tabstave clef=treble notation=true tablature=false key=G
      notes :q F-E/5-D-C/5 $.top.$ $2$ | B/4-A/4-G-F/4 | E-D/4-C/4-B/3 | A-G/3-A-B/3 =:| :w G/3=|=

      options stave-distance=50 space=20
      tabstave clef=treble notation=true tablature=false key=G time=4/4
      text :q,.-1,Start up bow and down bow
      text :q $.am/top.$
      notes :q =|: G/3-A/3-B/3^3^-C/4-D/4-E/4^3^ | F-G/4-A/4^3^-B/4-C-D/5^3^ $.top.$ $1$ | E/5-F/5-G/5^3^-A/5-B/5-C/6^3^ $.top.$ $1$ | D-E/6-F/6^3^-D/6-E-F/6^3^ 
 
      
      tabstave clef=treble notation=true tablature=false key=G
      notes :q  G/6 $.top.$ $4$ -F/6 $.top.$ $4$ -E/6^3^-D/6-C/6-B/5^3^ $.top.$ $2$ | A-G/5-F/5^3^-E/5-D-C/5^3^ $.top.$ $2$ | B/4-A/4-G/4^3^-F/4-E-D/4^3^ | C/4-B/3-A/3^3^-G/3-A-B/3^3^ =:| :w G/3=|=



      options stave-distance=50 space=20
      tabstave clef=treble notation=true tablature=false key=G time=4/4
      text :q,.-1,Start up bow and down bow
      text :8 $.am/top.$
      notes :8 =|: :8 G/3-A/3-B/3-C/4^5^ D/4-E/4-F/4-G/4 ^4^ | A/4-B/4-C-D/5 ^4^ $.top.$ $1$ E/5-F/5-G/5-A/5^4^ | B/5-C/6 $.top.$ $1$ D-E/6^4^ F/6-D/6-E-F/6 ^4^ 
 
      
      tabstave clef=treble notation=true tablature=false key=G
      notes :8  G/6 $.top.$ $4$ F/6 $.top.$ $4$ E/6-D/6 ^4^ C/6-B/5 $.top.$ $2$ A-G/5^4^ | F/5-E/5-D-C/5 ^4^ $.top.$ $2$ B/4-A/4-G/4-F/4 ^4^ | E-D/4-C/4-B/3 ^4^ A/3-G/3-A-B/3 ^4^ =:| :w G/3=|=



      options stave-distance=50 space=20
      tabstave clef=treble notation=true tablature=false key=G time=4/4
      text :q,.-1,Start up bow and down bow
      text :8 $.am/top.$
      notes :8 =|: :8 G/3-A/3-B/3-C/4-D/4^5^ :8 E/4-F/4-G/4-A/4-B/4 ^5^ |C-D/5 $.top.$ $1$ E/5-F/5-G/5 ^5^ A/5-B/5-C/6 $.top.$ $1$ D/6-E/6 ^5^ | F/6-D/6-E-F/6-G/6 ^5^ $.top.$ $4$ F/6 $.top.$ $4$ E/6-D/6-C/6-B/5 $.top.$ $2$^5^
 
      
      tabstave clef=treble notation=true tablature=false key=G
      notes :8   A/5-G/5-F/5-E/5-D/5 ^5^ C/5 $.top.$ $2$ B/4-A/4-G/4-F/4 ^5^ | E-D/4-C/4-B/3-A/3 ^5^ A/3-G/3-G/3-A-B/3 ^5^ =:| :w G/3=|=

      options stave-distance=50 space=20
      tabstave clef=treble notation=true tablature=false key=G time=4/4
      text :q,.-1,Start up bow and down bow
      text :8 $.am/top.$
      notes :8 =|: :8 G/3-A/3-B/3-C/4-D/4-E/4 ^6^ F/4-G/4-A/4-B/4-C-D/5 ^6^ $.top.$ $1$ | E/5-F/5-G/5-A/5-B/5-C/6 ^6^ $.top.$ $1$ D/6-E/6-F/6-D/6-E-F/6 ^6^
 
      
      tabstave clef=treble notation=true tablature=false key=G
      notes :8 G/6 $.top.$ $4$ F/6 $.top.$ $4$ E/6-D/6-C/6-B/5 ^6^ $.top.$ $2$ A/5-G/5-F/5-E/5-D/5-C/5 ^6^ $.top.$ $2$ | B/4-A/4-G/4-F/4-E-D/4 ^6^ C/4-B/3-A/3-G/3-A-B/3 ^6^ =:| :w G/3=|=

      options stave-distance=50 space=20
      tabstave clef=treble notation=true tablature=false key=G time=4/4
      text :q,.-1,Start up bow and down bow
      text :8 $.am/top.$
      notes :8 =|: :8 G/3-A/3-B/3-C/4-D/4-E/4-F/4^7^ G/4-A/4-B/4-C-D/5 $.top.$ $1$ E/5-F/5 ^7^ | G/5-A/5-B/5-C/6 $.top.$ $1$ D/6-E/6-F/6 ^7^ G/6 $.top.$ $4$ F/6 $.top.$ $4$ E/6-D/6-C/6-B/5 $.top.$ $2$ A/5 ^7^
 
      
      tabstave clef=treble notation=true tablature=false key=G
      notes :8 G/5-F/5-E/5-D/5-C/5 $.top.$ $2$ B/4-A/4 ^7^ G/4-F/4-E-D/4-C/4-B/3-A/3  ^7^ =:| :w G/3=|=


      options stave-distance=50 space=20
      tabstave clef=treble notation=true tablature=false key=G time=4/4
      text :q,.-1,Start up bow and down bow
      text :16 $.am/top.$
      notes :16 =|: :16 G/3-A/3-B/3-C/4 D/4-E/4-F/4-G/4 A/4-B/4-C-D/5 $.top.$ $1$ E/5-F/5-G/5-A/5 | B/5-C/6 $.top.$ $1$ D-E/6 F/6-D/6-E-F/6 G/6 $.top.$ $4$ F/6 $.top.$ $4$ E/6-D/6 C/6-B/5 $.top.$ $2$ A-G/5
 
      
      tabstave clef=treble notation=true tablature=false key=G
      notes :16  F/5-E/5-D-C/5 $.top.$ $2$ B/4-A/4-G/4-F/4 E-D/4-C/4-B/3 A/3-G/3-A-B/3 =:| :w G/3=|=




      `;
    } else if (keyInfo === "Ab Major" || keyInfo === "A Major") {
      vextabCanvas = `
      ${TabStaveOptions}
      ${TabStaveText}
      ${TabStaveHeaderText}
      ${AflatMajorNotesScaleUp}
      ${FirstFingerScalesTextUp}

      ${TabStaveText}
      ${AflatMajorNotesScaleDown}
      ${FirstFingerScalesTextDown}

      `;
    } else if (keyInfo === "Bb Major" || keyInfo === "B Major") {
      vextabCanvas = `
      ${TabStaveOptions}
      ${TabStaveText}
      ${TabStaveHeaderText}
      ${"notes " + scalee}
      ${FirstFingerScalesTextUp}

      ${TabStaveText}
      ${AflatMajorNotesScaleDown}
      ${FirstFingerScalesTextDown}

      `;
    } else if (keyInfo === "C Major" || keyInfo === "C# Major") {
      scaleVariableUp = `C/4-D-E-F-G-A-B/4-C-D-E-F-G-A-B/5-C-D-E-F-G-A-B-G-A-B/6`;
      scaleVariableDown = `C/7-B-A-G-F-E-D-C/6-B-A-G-F-E-D-C/5-B-A-G-F-E-D-C/4-B/3-D/4-C/4`;
      vextabCanvas = `
      ${TabStaveOptions}
      ${TabStaveText}
      ${TabStaveHeaderText}
      ${"notes " + scaleVariableUp + "  "}
      ${SecondFingerScalesTextUp}

      ${TabStaveText}
      ${"notes " + scaleVariableDown + "  "}
      ${SecondFingerScalesTextDown}

      `;
    } else if (keyInfo === "D Major" || keyInfo === "D# Major") {
      if (keyInfo === "D# Major") {
        TabStaveText = `tabstave clef=treble notation=true tablature=false key=D#m`;
      }
      scaleVariableUp = `D/4-E-F-G-A-B/4-C-D-E-F-G-A-B/5-C-D-E-F-G-A-B/6-C/7-A/6-B/6-C/7`;
      scaleVariableDown = `D-C/7-B-A-G-F-E-D-C/6-B-A-G-F-E-D-C/5-B-A-G-F-E-D-C/4-E/4-D/4`;
      vextabCanvas = `
      ${TabStaveOptions}
      ${TabStaveText}
      ${TabStaveHeaderText}
      ${"notes " + scaleVariableUp + "  "}
      ${SecondFingerScalesTextUp}
      
      ${TabStaveText}
      ${"notes " + scaleVariableDown + "  "}
      ${SecondFingerScalesTextDown}
      
      `;
    } else if (keyInfo === "E Major" || keyInfo === "Eb Major") {
      let SecondFingerScalesTextUp = `text ++,.2,2, , , , , , , , ,.0, 3, .0, 1, , , , , , .-3, 3, .-3, 1`;

      let SecondFingerScalesTextDown = `text :q,.-5,4,.-5,4, , ,.-4, 1,.-3,3, , , , , ,.-1,1, .0, 3`;
      scaleVariableUp = `E/4-F-G-A-B/4-C-D-E-F-G-A-B/5-C-D-E-F-G-A-B/6-C/7-D/7-B/6-C/7-D/7`;
      scaleVariableDown = `E-D-C/7-B-A-G-F-E-D-C/6-B-A-G-F-E-D-C/5-B-A-G-F-E-D-F-E/4`;
      vextabCanvas = `
      ${TabStaveOptions}
      ${TabStaveText}
      ${TabStaveHeaderText}
      ${"notes " + scaleVariableUp + "  "}
      ${SecondFingerScalesTextUp}

      ${TabStaveText}
      ${"notes " + scaleVariableDown + "  "}
      ${SecondFingerScalesTextDown}

      `;
    } else if (keyInfo === "F Major" || keyInfo === "F# Major") {
      let TabStaveOptions = `options stave-distance=150 space=30`;

      let SecondFingerScalesTextUp = `text ++,.2,2, , , , , , , , ,.0, 3, .0, 1, , , , , , .-3, 3, .-4, 1`;
      let SecondFingerScalesTextDown = `text :q,.-5,4,.-5,4, , ,.-4, 1,.-3,3, , , , , ,.-1,1, .0, 3`;
      scaleVariableUp = `F-G-A-B/4-C-D-E-F-G-A-B/5-C-D-E-F-G-A-B/6-C/7-D/7-E/7-C-D/7-E/7`;
      scaleVariableDown = `F-E-D-C/7-B-A-G-F-E-D-C/6-B-A-G-F-E-D-C/5-B-A-G-F-E-G-F/4`;
      vextabCanvas = `
      ${TabStaveOptions}
      ${TabStaveText}
      ${TabStaveHeaderText}
      ${"notes " + scaleVariableUp + "  "}
      ${SecondFingerScalesTextUp}

      ${TabStaveText}
      ${"notes " + scaleVariableDown + "  "}
      ${SecondFingerScalesTextDown}

      `;
    }

    // create DOM element
    const tabDOM = document.getElementById(id);
    if (tabDOM) {
      tabDOM.innerHTML = "";
    }
    // Create VexFlow Renderer from canvas element with id #boo
    const renderer = new Renderer(tabDOM, Renderer.Backends.SVG);

    // // Initialize VexTab artist and parser.
    const artist = new Artist(10, 10, 900, { scale: 0.8 });
    const tab = new VexTab(artist);

    try {
      tab.parse(vextabCanvas);
      artist.render(renderer);
      if (container.current) {
        tabDOM.container.current.appendChild(``);
      }
    } catch (e) {}
  }, [keyInfo]);

  return (
    <>
      <div className={classes.scalesMainPDFSection}>
        <div className={classes.scalesMainPDFContainer} ref={container2}>
          <div className={classes.scalesMainHeaderContainer}>
            <div className={classes.scalesMainHeaderText}>Scales</div>
          </div>
          <div className={classes.scalesScaleInfoContainer}>
            <div className={classes.scalesScaleInfoKeyText}>
              {key_signature}
            </div>
          </div>
          <div className={classes.scalesMusicSection}>
            <div className={classes.scalesMusicContainer}>
              <div
                id={id}
                className={classes.scalesMusic}
                ref={container}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
