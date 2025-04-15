// import Vex from "vexflow";
// // Create an SVG renderer and attach it to the DIV element named "boo".

// setTimeout(() => {
//   const VF = Vex.Flow;
//   var div = document.getElementById("boo");
//   var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
//   renderer.resize(200, 200);
//   const context = renderer.getContext();

//   context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

//   // Create a stave of width 400 at position 10, 40 on the canvas.
//   const stave = new VF.Stave(10, 40, 400);

//   // Add a clef and time signature.
//   stave.addClef("treble").addTimeSignature("4/4");

//   // Connect it to the rendering context and draw!
//   stave.setContext(context).draw();

//   console.log("stave", stave);
//   console.log("context", context);
// }, 500);

// setTimeout(() => {
//   const vf = new Vex.Flow.Factory({
//     renderer: { elementId: "leo", width: 500, height: 200 }
//   });

//   const score = vf.EasyScore();
//   const system = vf.System();

//   system
//     .addStave({
//       voices: [
//         score.voice(score.notes("C#5/q, B4, A4, G#4", { stem: "up" })),
//         score.voice(score.notes("C#4/h, C#4", { stem: "down" }))
//       ]
//     })
//     .addClef("treble")
//     .addTimeSignature("4/4");

//   vf.draw();
// });
