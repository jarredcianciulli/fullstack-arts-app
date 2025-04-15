import React, { useRef, useEffect } from "react";

const Canvas = (props) => {
  return <canvas ref={props.canvasRef} {...props} />;
};

export default Canvas;
