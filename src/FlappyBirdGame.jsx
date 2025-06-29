import React, { useRef, useEffect, useState } from "react";

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 32;
const GRAVITY = 0.5;
const JUMP = -8;
const TUBE_WIDTH = 60;
const TUBE_GAP = 160;
const TUBE_SPEED = 2;

function getRandomTubeY() {
  return Math.floor(Math.random() * (GAME_HEIGHT - TUBE_GAP - 100)) + 50;
}

function BlueBird() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <ellipse cx="16" cy="18" rx="13" ry="10" fill="#2196f3" stroke="#1565c0" strokeWidth="2" />
      <ellipse cx="24" cy="14" rx="4" ry="3" fill="#2196f3" stroke="#1565c0" strokeWidth="1.5" />
      <ellipse cx="10" cy="10" rx="3" ry="2.5" fill="#2196f3" stroke="#1565c0" strokeWidth="1.5" />
      <circle cx="21" cy="19" r="2.2" fill="#fff" />
      <circle cx="21.7" cy="19" r="1.1" fill="#222" />
      <polygon points="29,18 27,17 27,19" fill="#ffb300" />
    </svg>
  );
}

export default function FlappyBirdGame() {
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [tubes, setTubes] = useState([
    { x: GAME_WIDTH + 100, y: getRandomTubeY() },
    { x: GAME_WIDTH + 300, y: getRandomTubeY() }
  ]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const requestRef = useRef();

  useEffect(() => {
    if (gameOver) return;
    const animate = () => {
      setBirdY(prev => {
        let next = prev + velocity;
        if (next < 0) next = 0;
        if (next > GAME_HEIGHT - BIRD_SIZE) {
          setGameOver(true);
          next = GAME_HEIGHT - BIRD_SIZE;
        }
        return next;
      });
      setVelocity(v => v + GRAVITY);
      setTubes(prevTubes => {
        let newTubes = prevTubes.map(tube => ({ ...tube, x: tube.x - TUBE_SPEED }));
        if (newTubes[0].x < -TUBE_WIDTH) {
          newTubes.shift();
          newTubes.push({ x: GAME_WIDTH, y: getRandomTubeY() });
          setScore(s => s + 1);
        }
        // Collision detection
        newTubes.forEach(tube => {
          if (
            tube.x < 60 + BIRD_SIZE &&
            tube.x + TUBE_WIDTH > 60 &&
            (birdY < tube.y || birdY + BIRD_SIZE > tube.y + TUBE_GAP)
          ) {
            setGameOver(true);
          }
        });
        return newTubes;
      });
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [velocity, birdY, gameOver]);

  const handleJump = () => {
    if (gameOver) {
      setBirdY(GAME_HEIGHT / 2);
      setVelocity(0);
      setTubes([
        { x: GAME_WIDTH + 100, y: getRandomTubeY() },
        { x: GAME_WIDTH + 300, y: getRandomTubeY() }
      ]);
      setScore(0);
      setGameOver(false);
    } else {
      setVelocity(JUMP);
    }
  };

  return (
    <div
      tabIndex={0}
      style={{
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        background: "#aeefff",
        position: "relative",
        overflow: "hidden",
        outline: "none",
        margin: "2rem auto",
        borderRadius: 12,
        boxShadow: "0 2px 16px #aaa"
      }}
      onClick={handleJump}
      onKeyDown={e => e.code === "Space" && handleJump()}
    >
      {/* Bird */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: birdY,
          width: BIRD_SIZE,
          height: BIRD_SIZE,
          pointerEvents: 'none',
        }}
      >
        <BlueBird />
      </div>
      {/* Tubes */}
      {tubes.map((tube, i) => (
        <React.Fragment key={i}>
          {/* Top tube */}
          <div
            style={{
              position: "absolute",
              left: tube.x,
              top: 0,
              width: TUBE_WIDTH,
              height: tube.y,
              background: "#fff",
              border: "3px solid #bbb",
              borderRadius: "0 0 24px 24px"
            }}
          />
          {/* Bottom tube */}
          <div
            style={{
              position: "absolute",
              left: tube.x,
              top: tube.y + TUBE_GAP,
              width: TUBE_WIDTH,
              height: GAME_HEIGHT - (tube.y + TUBE_GAP),
              background: "#fff",
              border: "3px solid #bbb",
              borderRadius: "24px 24px 0 0"
            }}
          />
        </React.Fragment>
      ))}
      {/* Score and Game Over */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 0,
          width: "100%",
          textAlign: "center",
          fontSize: 32,
          fontWeight: 700,
          color: "#1565c0",
          textShadow: "0 2px 8px #fff"
        }}
      >
        {gameOver ? "Game Over! " : "Score: "}{score}
      </div>
      {gameOver && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: "100%",
            textAlign: "center",
            fontSize: 24,
            color: "#1565c0",
            fontWeight: 600,
            textShadow: "0 2px 8px #fff"
          }}
        >
          Click or press Space to restart
        </div>
      )}
    </div>
  );
}
