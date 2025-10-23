import { useState } from 'react'
import Home from './components/Home'
import About from './components/About'
import { Link, Route, Routes } from 'react-router-dom'



function App() {
 
  return (
    <div className=""> {/* Added full height and white background */}
    <nav>
        <ul>
          <li className='text-black'>
            <Link to="/">Home</Link>
          </li>
          <li className='text-black'>
            <Link to="/about">About</Link>
          </li>
          <li>
           
          </li>
        </ul>
      </nav>

      <hr />
    <Routes>
        {/* A Route defines a path and the component to render */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
       
      </Routes>
    </div>   
  )
}

export default App
