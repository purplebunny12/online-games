import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { games } from './games'

function renderStars(rating) {
  return (
    <span style={{ color: '#f5c518' }}>
      {Array.from({ length: 5 }, (_, i) => (i < rating ? '★' : '☆')).join('')}
    </span>
  );
}

function App() {
  const [count, setCount] = useState(0)

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
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <h2>Games</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        {games.map(game => (
          <div key={game.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, width: 220, boxShadow: '0 2px 8px #eee', background: '#fff' }}>
            <img src={game.image} alt={game.name} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }} />
            <h3 style={{ margin: '8px 0 4px' }}>{game.name}</h3>
            <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>{game.category}</div>
            <div style={{ marginBottom: 8 }}>{game.description}</div>
            <div>{renderStars(game.rating)}</div>
          </div>
        ))}
      </div>
    </>
  )
}

export default App
