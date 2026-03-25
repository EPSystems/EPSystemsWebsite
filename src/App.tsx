import { Routes, Route, Navigate } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { ContactModalProvider } from './components/contact/ContactModalProvider'
import { HomePage } from './pages/HomePage'
import { ServicePage } from './pages/ServicePage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <ContactModalProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/en/" replace />} />
        <Route path="/:lang" element={<HomePage />} />
        <Route path="/:lang/services/:slug" element={<ServicePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ContactModalProvider>
  )
}

export default App
