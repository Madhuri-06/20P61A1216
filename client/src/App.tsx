import './App.css'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';

function App() {
  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/products" element={<Products/>} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>

    </MantineProvider>
  )
}

export default App
