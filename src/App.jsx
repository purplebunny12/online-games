import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { games } from './games'
import FlappyBirdGame from './FlappyBirdGame.jsx'
import MemoryGame from './MemoryGame.jsx'

function App() {
  const [selectedGame, setSelectedGame] = useState(null);

  const renderGame = () => {
    if (selectedGame === 'flappy-bird') return <FlappyBirdGame />;
    if (selectedGame === 'memory') return <MemoryGame />;
    return null;
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Games</h1>
      {!selectedGame ? (
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', margin: '2rem 0' }}>
          {games.map(game => (
            <div
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              style={{
                width: 160,
                height: 200,
                background: '#fff',
                border: '2px solid #2196f3',
                borderRadius: 12,
                boxShadow: '0 2px 8px #eee',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'transform 0.15s',
                position: 'relative',
              }}
            >
              <img src={game.image} alt={game.name} style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: 12 }} />
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{game.name}</div>
              <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>{game.description}</div>
              <div style={{ color: '#f5c518', fontSize: 18 }}>
                {Array.from({ length: 5 }, (_, i) => (i < game.rating ? '★' : '☆')).join('')}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <button onClick={() => setSelectedGame(null)} style={{ margin: '1rem 0', padding: '8px 20px', borderRadius: 6, background: '#2196f3', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Back to Games</button>
          {renderGame()}
        </>
      )}
    </>
  )
}

export default App
