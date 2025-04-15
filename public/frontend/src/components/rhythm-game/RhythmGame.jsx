import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import BallIcon from "./assets/rhythm_ball.svg";

import classes from "./RhythmGame.module.css";

function RhythmGame() {
  const instructions = "press the SPACEBAR to start game";
  const ballStatus = useRef(false);
  const [gameInstructions, setGameInstructions] = useState(instructions);
  const [startGame, setStartGame] = useState(null);

  const ballBounceP1AX = keyframes`to {
    left: 0px;
  }`;
  const ballBounceP1AY = keyframes`to {
    top: 99.5px;
  }`;
  const ballBounceP2AX = keyframes`from {
    left: 0px;
  }
  to {
    left: 7%;
  }`;
  const ballBounceP2AY = keyframes`to {
    top: 99.5px;
  }`;
  const ballBounceP3AX = keyframes`from {
    left: 7%;
  }
  to {
    left: 17%;
  }`;
  const ballBounceP3AY = keyframes`to {
    top: 99.5px;
  }`;
  const ballBounceP4AX = keyframes`from {
    left: 17%;
  }
  to {
    left: 22%;
  }`;
  const ballBounceP4AY = keyframes`to {
    top: 99.5px;
  }`;
  const ballBounceP5AX = keyframes`from {
    left: 220px;
  }
  to {
    left: 270px;
  }`;
  const ballBounceP5AY = keyframes`to {
    top: 99.5px;
  }`;
  const ballBounceP6AX = keyframes`from {
    left: 270px;
  }
  to {
    left: 360px;
  }`;
  const ballBounceP6AY = keyframes`to {
    top: 99.5px;
  }`;
  const ballBounceP7AX = keyframes`from {
    left: 360px;
  }
  to {
    left: 900px;
  }`;
  const ballBounceP7AY = keyframes`to {
    top: 99.5px;
  }`;

  const BallAnimation = styled.img`
    animation: ${ballBounceP1AX} 1s linear 0s 4,
      ${ballBounceP1AY} 1s none 0s 3 cubic-bezier(0, 333.33, 1, 333.33),
      ${ballBounceP2AX} 1s linear 3s,
      ${ballBounceP2AY} 1s none 3s cubic-bezier(0, 333.33, 1, 333.33),
      ${ballBounceP3AX} 1s linear 4s,
      ${ballBounceP3AY} 1s none 4s cubic-bezier(0, 333.33, 1, 333.33),
      ${ballBounceP4AX} 0.5s linear 5s,
      ${ballBounceP4AY} 0.5s none 5s cubic-bezier(0, 233.33, 1, 233.33),
      ${ballBounceP5AX} 0.5s linear 5.5s,
      ${ballBounceP5AY} 0.5s none 5.5s cubic-bezier(0, 233.33, 1, 233.33),
      ${ballBounceP6AX} 1s linear 6s,
      ${ballBounceP6AY} 1s none 6s cubic-bezier(0, 333.33, 1, 333.33),
      ${ballBounceP7AX} 1s linear 7s,
      ${ballBounceP7AY} 1s none 7s cubic-bezier(0, 333.33, 1, 333.33);
  `;

  useEffect(() => {
    document.addEventListener("keydown", async (event) => {
      event.preventDefault();

      if (event.key === " " && startGame == true) {
        return;
      }
      if (
        event.key === " " &&
        (startGame == false || startGame == null) &&
        ballStatus.current == false
      ) {
        setGameInstructions("");
        setStartGame(true);
        ballStatus.current = true;
        await setTimeout(() => {
          setStartGame(false);
          ballStatus.current = false;
          setGameInstructions(instructions);
        }, 8000);
      }
    });
  }, []);

  return (
    <>
      <div className={classes.gameInstructionsContainer}>
        <div className={classes.gameInstructionsText}>{gameInstructions}</div>
      </div>
      <div className={classes.headerSpace}></div>
      <div className={classes.rhythmContainer}>
        <div className={classes.rhythmSection}>
          {startGame && (
            <BallAnimation
              className={`${classes.rhythmBall} ${classes.startAn}`}
              alt=""
              src={BallIcon}
            />
          )}
          {!startGame && (
            <img
              className={`${classes.rhythmBall} ${classes.startAn}`}
              alt=""
              src={BallIcon}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default RhythmGame;
