import React, { useRef, useEffect, useState } from "react";

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 54;
const GRAVITY = 0.8;
const JUMP = -11;
const TUBE_SPEED = 4;

// Tube dimensions
const TUBE_WIDTH = 52;
const TUBE_GAP = 160; // Gap between top and bottom tubes

const DIFFICULTY_CONFIG = {
  Easy:   { GRAVITY: 0.5, JUMP: -7, TUBE_SPEED: 2 },
  Normal: { GRAVITY: 0.65, JUMP: -9, TUBE_SPEED: 3 },
  Hard:   { GRAVITY: 0.85, JUMP: -11, TUBE_SPEED: 3.7 }
};

function getRandomTubeY() {
  return Math.floor(Math.random() * (GAME_HEIGHT - 160 - 100)) + 50;
}

function BlueBird() {
  return (
    <svg width="48" height="48" viewBox="0 0 32 32">
      {/* Body (oval) */}
      <ellipse cx="18" cy="20" rx="10" ry="7" fill="#2196f3" stroke="#1565c0" strokeWidth="2" />
      {/* Tail */}
      <polygon points="7,20 2,17 7,23" fill="#1976d2" />
      {/* Wing */}
      <ellipse cx="18" cy="22" rx="5" ry="2.5" fill="#64b5f6" stroke="#1565c0" strokeWidth="1" />
      {/* Head (smaller oval) */}
      <ellipse cx="25" cy="15" rx="5" ry="4" fill="#2196f3" stroke="#1565c0" strokeWidth="1.5" />
      {/* Beak */}
      <polygon points="31,15 27,14 27,16" fill="#ffb300" />
      {/* Eye */}
      <circle cx="27" cy="15" r="1.1" fill="#fff" />
      <circle cx="27.5" cy="15" r="0.5" fill="#222" />
    </svg>
  );
}

export default function FlappyBirdGame() {
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [velocity, setVelocity] = useState(0);
  const [tubes, setTubes] = useState([
    { x: GAME_WIDTH + 100, y: getRandomTubeY(), scored: false },
    { x: GAME_WIDTH + 300, y: getRandomTubeY(), scored: false }
  ]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  // Use a different highscore for each difficulty
  const [highScore, setHighScore] = useState(() => {
    const key = `flappyHighScore_${difficulty}`;
    return Number(localStorage.getItem(key) || 0);
  });
  // Update highscore when difficulty changes
  useEffect(() => {
    const key = `flappyHighScore_${difficulty}`;
    setHighScore(Number(localStorage.getItem(key) || 0));
  }, [difficulty]);
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('Easy');
  const requestRef = useRef();

  const { GRAVITY, JUMP, TUBE_SPEED } = DIFFICULTY_CONFIG[difficulty];

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      const key = `flappyHighScore_${difficulty}`;
      localStorage.setItem(key, score);
    }
  }, [gameOver, score, highScore, difficulty]);

  useEffect(() => {
    if (!started) return;
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
        // Score update: as soon as bird passes tube's right edge
        newTubes = newTubes.map(tube => {
          const birdLeft = 60;
          const birdRight = 60 + BIRD_SIZE;
          const tubeRight = tube.x + TUBE_WIDTH;
          if (!tube.scored && birdLeft > tubeRight) {
            setScore(s => s + 1);
            return { ...tube, scored: true };
          }
          return tube;
        });
        if (newTubes[0].x < -TUBE_WIDTH) {
          newTubes.shift();
          newTubes.push({ x: GAME_WIDTH, y: getRandomTubeY(), scored: false });
        }
        // Collision detection: lose if the bird touches the top or bottom of the tube
        newTubes.forEach(tube => {
          const birdLeft = 60;
          const birdRight = 60 + BIRD_SIZE;
          const birdTop = birdY;
          const birdBottom = birdY + BIRD_SIZE;
          const tubeLeft = tube.x;
          const tubeRight = tube.x + TUBE_WIDTH;
          // Check horizontal overlap
          const horizontalOverlap = birdRight > tubeLeft && birdLeft < tubeRight;
          // Check if bird touches the bottom of the top tube
          const touchesTopTube = horizontalOverlap && birdTop < tube.y;
          // Check if bird touches the top of the bottom tube
          const touchesBottomTube = horizontalOverlap && birdBottom > tube.y + TUBE_GAP;
          if (touchesTopTube || touchesBottomTube) {
            setGameOver(true);
          }
        });
        return newTubes;
      });
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [velocity, birdY, gameOver, started]);

  useEffect(() => {
    // Reset game when difficulty changes
    setBirdY(GAME_HEIGHT / 2);
    setVelocity(0);
    setTubes([
      { x: GAME_WIDTH + 100, y: getRandomTubeY(), scored: false },
      { x: GAME_WIDTH + 300, y: getRandomTubeY(), scored: false }
    ]);
    setScore(0);
    setGameOver(false);
    setStarted(false);
  }, [difficulty]);

  const handleStart = () => {
    if (!started) {
      setStarted(true);
      setVelocity(JUMP);
      return;
    }
  };

  const handleJump = () => {
    if (!started) {
      setStarted(true);
      setVelocity(JUMP);
      return; // Remove this return to allow jump on first press
    }
    if (gameOver) {
      setBirdY(GAME_HEIGHT / 2);
      setVelocity(0);
      setTubes([
        { x: GAME_WIDTH + 100, y: getRandomTubeY(), scored: false },
        { x: GAME_WIDTH + 300, y: getRandomTubeY(), scored: false }
      ]);
      setScore(0);
      setGameOver(false);
      setStarted(false);
    } else {
      setVelocity(JUMP);
    }
  };

  // Show difficulty bar before every game (including after game over)
  const showDifficultyBar = !started;

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
      onKeyDown={e => e.code === "Space" && handleJump()}
      onClick={handleJump}
    >
      {/* Highscore bar */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          background: "#fff",
          color: "#1565c0",
          fontWeight: 700,
          fontSize: 20,
          padding: "6px 18px",
          borderRadius: 8,
          boxShadow: "0 2px 8px #eee",
          zIndex: 2
        }}
      >
        Highscore ({difficulty}): {highScore}
      </div>
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
        {gameOver ? "Game Over! " : started ? `Score: ${score}` : null}
      </div>
      {showDifficultyBar && (
        <>
          <button
            onClick={handleJump}
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              padding: "16px 40px",
              fontSize: 24,
              fontWeight: 700,
              background: "#2196f3",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              boxShadow: "0 2px 8px #bbb",
              cursor: "pointer",
              zIndex: 10
            }}
          >
            Start
          </button>
          {/* Difficulty Bar below Start button */}
          <div style={{
            position: 'absolute',
            top: 'calc(45% + 70px)',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'row',
            gap: 16,
            zIndex: 10
          }}>
            {['Easy', 'Normal', 'Hard'].map(level => (
              <button
                key={level}
                onClick={e => { e.stopPropagation(); setDifficulty(level); }}
                style={{
                  padding: '10px 24px',
                  fontSize: 18,
                  fontWeight: 700,
                  background: difficulty === level ? '#2196f3' : '#fff',
                  color: difficulty === level ? '#fff' : '#1565c0',
                  border: '2px solid #2196f3',
                  borderRadius: 8,
                  boxShadow: difficulty === level ? '0 2px 8px #bbb' : 'none',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </>
      )}
      {/* Game Over message */}
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
