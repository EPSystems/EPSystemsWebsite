import { Routes, Route, Navigate } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/en/" replace />} />
        <Route path="/:lang" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
