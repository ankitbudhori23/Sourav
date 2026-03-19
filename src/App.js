import React from 'react'
import Home from './pages/Home'
import { Routes ,Route, BrowserRouter} from "react-router"
import Services from './pages/Services'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/services" element={<Services />} />
      </Routes>
    </BrowserRouter>
  )
}
