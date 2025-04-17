import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import hiba from './assets/hiba.jpg' 
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="" target="_blank">
        <img src={hiba} style={{ width: '150px', height: 'auto' }} alt="hiba" />
        </a>
      </div>
      <h1>HELLLLOOOOO MRRRRR FAAAAJJJAARRRRR HAYYYAATTTTT</h1>
      <p1>
        how do u do?
      </p1>
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
    </>
  )
}

export default App
