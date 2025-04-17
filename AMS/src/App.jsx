import React from 'react'

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
  <div className="bg-white p-10 rounded-2xl shadow-xl text-center space-y-4">
  <h1 className="text-3xl font-extrabold text-gray-800">
    🚀 Tailwind Test Card
  </h1>
  <p className="text-gray-600">
    If you can see this styled card with a gradient background, Tailwind is working!
  </p>
  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-300">
    Click Me
  </button>
</div>
</div>
  )
}

export default App