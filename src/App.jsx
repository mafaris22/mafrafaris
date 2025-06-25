// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import JobDetailPage from './pages/JobDetailPage'
import ScrollToHash from './components/ScrollToHash'
import './App.css'

function App() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs/:jobId" element={<JobDetailPage />} />
      </Routes>
    </>
  )
}

export default App
