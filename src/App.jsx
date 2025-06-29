import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FlappyBirdGame from './FlappyBirdGame.jsx'
import MemoryGame from './MemoryGame.jsx'

function App() {
  const [selectedGame, setSelectedGame] = useState('flappy');

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
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', margin: '1rem 0' }}>
        <button onClick={() => setSelectedGame('flappy')} style={{ padding: '8px 20px', borderRadius: 6, background: selectedGame === 'flappy' ? '#2196f3' : '#eee', color: selectedGame === 'flappy' ? '#fff' : '#222', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Flappy Bird</button>
        <button onClick={() => setSelectedGame('memory')} style={{ padding: '8px 20px', borderRadius: 6, background: selectedGame === 'memory' ? '#2196f3' : '#eee', color: selectedGame === 'memory' ? '#fff' : '#222', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Memory Game</button>
      </div>
      {selectedGame === 'flappy' ? <FlappyBirdGame /> : <MemoryGame />}
    </>
  )
}

export default App
