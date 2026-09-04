import type { ReactNode } from 'react'
import { createBrowserRouter, Navigate, Outlet, type RouteObject } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { ScrollToTop } from './components/ScrollToTop'
import { ContactModalProvider } from './components/contact/ContactModalProvider'
import { CookieConsent } from './components/CookieConsent'

/**
 * Everything that must exist on every page. `extras` lets main.tsx append
 * prerender-only helpers (the "prerender-ready" signal) without the routes
 * knowing about them.
 */
function RootLayout({ extras }: { extras?: ReactNode }) {
  return (
    <ContactModalProvider>
      <ScrollToTop />
      <Outlet />
      <CookieConsent />
      <SpeedInsights />
      {extras}
    </ContactModalProvider>
  )
}

/**
 * Route table. Every page is a lazy route, so each URL downloads only its own
 * chunk (plus shared vendor code) instead of one bundle holding every page and
 * every blog post. main.tsx waits for the router to finish loading the current
 * route before mounting, so prerendered HTML is never replaced by a fallback.
 */
export function createAppRouter(extras?: ReactNode) {
  const routes: RouteObject[] = [
    {
      element: <RootLayout extras={extras} />,
      children: [
        { path: '/', element: <Navigate to="/bg/" replace /> },
        { path: '/:lang', lazy: () => import('./pages/HomePage').then((m) => ({ Component: m.HomePage })) },
        { path: '/:lang/services', lazy: () => import('./pages/Services').then((m) => ({ Component: m.Services })) },
        { path: '/:lang/services/:slug', lazy: () => import('./pages/ServicePage').then((m) => ({ Component: m.ServicePage })) },
        { path: '/:lang/industries/:slug', lazy: () => import('./pages/Industry').then((m) => ({ Component: m.Industry })) },
        { path: '/:lang/projects', lazy: () => import('./pages/Projects').then((m) => ({ Component: m.Projects })) },
        { path: '/:lang/contact', lazy: () => import('./pages/Contact').then((m) => ({ Component: m.Contact })) },
        { path: '/:lang/pricing', lazy: () => import('./pages/Pricing').then((m) => ({ Component: m.Pricing })) },
        { path: '/:lang/blog', lazy: () => import('./pages/Blog').then((m) => ({ Component: m.Blog })) },
        { path: '/:lang/blog/category/:slug', lazy: () => import('./pages/BlogCategory').then((m) => ({ Component: m.BlogCategory })) },
        { path: '/:lang/blog/:slug', lazy: () => import('./pages/BlogPost').then((m) => ({ Component: m.BlogPost })) },
        { path: '/:lang/privacy-policy', lazy: () => import('./pages/PrivacyPolicy').then((m) => ({ Component: m.PrivacyPolicy })) },
        { path: '/:lang/about', lazy: () => import('./pages/About').then((m) => ({ Component: m.About })) },
        { path: '/:lang/about/team/:slug', lazy: () => import('./pages/TeamMember').then((m) => ({ Component: m.TeamMember })) },
        { path: '/:lang/resources', lazy: () => import('./pages/Resources').then((m) => ({ Component: m.Resources })) },
        { path: '*', lazy: () => import('./pages/NotFoundPage').then((m) => ({ Component: m.NotFoundPage })) },
      ],
    },
  ]
  return createBrowserRouter(routes)
}
