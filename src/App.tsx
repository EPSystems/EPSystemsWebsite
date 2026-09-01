import { Routes, Route, Navigate } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { ScrollToTop } from './components/ScrollToTop'
import { ContactModalProvider } from './components/contact/ContactModalProvider'
import { CookieConsent } from './components/CookieConsent'
import { HomePage } from './pages/HomePage'
import { ServicePage } from './pages/ServicePage'
import { Services } from './pages/Services'
import { Industry } from './pages/Industry'
import { Projects } from './pages/Projects'
import { Contact } from './pages/Contact'
import { Pricing } from './pages/Pricing'
import { Blog } from './pages/Blog'
import { BlogPost } from './pages/BlogPost'
import { BlogCategory } from './pages/BlogCategory'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { About } from './pages/About'
import { TeamMember } from './pages/TeamMember'
import { Resources } from './pages/Resources'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <ContactModalProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/bg/" replace />} />
        <Route path="/:lang" element={<HomePage />} />
        <Route path="/:lang/services" element={<Services />} />
        <Route path="/:lang/services/:slug" element={<ServicePage />} />
        <Route path="/:lang/industries/:slug" element={<Industry />} />
        <Route path="/:lang/projects" element={<Projects />} />
        <Route path="/:lang/contact" element={<Contact />} />
        <Route path="/:lang/pricing" element={<Pricing />} />
        <Route path="/:lang/blog" element={<Blog />} />
        <Route path="/:lang/blog/category/:slug" element={<BlogCategory />} />
        <Route path="/:lang/blog/:slug" element={<BlogPost />} />
        <Route path="/:lang/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/:lang/about" element={<About />} />
        <Route path="/:lang/about/team/:slug" element={<TeamMember />} />
        <Route path="/:lang/resources" element={<Resources />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <CookieConsent />
      <SpeedInsights />
    </ContactModalProvider>
  )
}

export default App
