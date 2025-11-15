import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import ShoppingCartPage from './pages/ShoppingCart'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<ShoppingCartPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

