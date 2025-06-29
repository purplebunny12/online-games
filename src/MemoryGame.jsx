import React, { useState, useEffect } from "react";

const CARD_IMAGES = [
  "🍎", "🍌", "🍇", "🍉", "🍒", "🍋"
];

function shuffle(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const doubled = shuffle([...CARD_IMAGES, ...CARD_IMAGES]);
    setCards(doubled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setWon(false);
  }, []);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [matched, cards]);

  const handleFlip = idx => {
    if (flipped.length === 2 || flipped.includes(idx) || matched.includes(idx)) return;
    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [i, j] = newFlipped;
      if (cards[i] === cards[j]) {
        setTimeout(() => {
          setMatched(m => [...m, i, j]);
          setFlipped([]);
        }, 800);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  const handleRestart = () => {
    const doubled = shuffle([...CARD_IMAGES, ...CARD_IMAGES]);
    setCards(doubled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setWon(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", textAlign: "center" }}>
      <h2>Memory Game</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 60px)", gap: 12, justifyContent: "center" }}>
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => handleFlip(idx)}
            style={{
              width: 60,
              height: 60,
              fontSize: 32,
              background: matched.includes(idx) || flipped.includes(idx) ? "#fff" : "#2196f3",
              color: matched.includes(idx) || flipped.includes(idx) ? "#222" : "#2196f3",
              border: "2px solid #1565c0",
              borderRadius: 8,
              cursor: "pointer"
            }}
            disabled={matched.includes(idx)}
          >
            {matched.includes(idx) || flipped.includes(idx) ? card : "?"}
          </button>
        ))}
      </div>
      <div style={{ margin: "1rem 0" }}>Moves: {moves}</div>
      {won && <div style={{ color: "#388e3c", fontWeight: 600 }}>You won! 🎉</div>}
      <button onClick={handleRestart} style={{ marginTop: 12, padding: "8px 20px", borderRadius: 6, background: "#1565c0", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}>Restart</button>
    </div>
  );
}
