import React, { useRef, useEffect } from "react";

export function Tab({ id, children }) {
  const { Vex, VexTab, Artist } = window.vextab;
  Artist.NOLOGO = true;

  const Renderer = Vex.Flow.Renderer;
  const container = useRef(null);

  useEffect(() => {
    const tabDOM = document.getElementById(id);
    if (tabDOM) {
      tabDOM.innerHTML = "";
    }
    // Create VexFlow Renderer from canvas element with id #boo
    const renderer = new Renderer(tabDOM, Renderer.Backends.SVG);

    // // Initialize VexTab artist and parser.
    const artist = new Artist(10, 10, 600, { scale: 0.8 });
    const tab = new VexTab(artist);

    try {
      tab.parse(children);
      artist.render(renderer);
    } catch (e) {
      console.log(e);
    }
  }, []);

  return <div id={id} ref={container} />;
}
