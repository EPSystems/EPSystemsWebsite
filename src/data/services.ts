import {
  Search,
  Globe,
  ShoppingCart,
  Bot,
  FileText,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Service {
  id: string
  icon: LucideIcon
  title: string
  titleBreak: string
  description: string
  features: string[]
  variant: 'light' | 'lime' | 'dark'
  detailHeadline?: string
  detailDescription?: string
  ctaText?: string
}

export const services: Service[] = [
  {
    id: 'seo',
    icon: Search,
    title: 'Search Engine',
    titleBreak: 'Optimization',
    description: 'Data-driven SEO strategies to dominate search results and capture high-intent traffic.',
    features: ['Technical SEO Audits', 'On-Page Optimization', 'Authority Link Building'],
    variant: 'light',
    detailHeadline: 'Dominate search results and capture high-intent traffic.',
    detailDescription: 'We use data-driven strategies, technical audits, and high-quality link building to push your website to the top of Google. Stop hiding on page two.',
    ctaText: 'Get a Free SEO Audit',
  },
  {
    id: 'websites',
    icon: Globe,
    title: 'Custom',
    titleBreak: 'Websites',
    description: 'Beautiful, fast, responsive websites tailored to your brand and business goals.',
    features: ['Responsive Design', 'Performance Optimized', 'CMS Integration'],
    variant: 'lime',
  },
  {
    id: 'ecommerce',
    icon: ShoppingCart,
    title: 'E-Commerce',
    titleBreak: 'Solutions',
    description: 'Full-featured online stores with payment integration, inventory management, and analytics.',
    features: ['Payment Integration', 'Inventory Management', 'Order Tracking Dashboards'],
    variant: 'dark',
    detailHeadline: 'Launch your online store and start selling worldwide.',
    detailDescription: 'We build full-featured e-commerce platforms with secure payments, inventory management, and analytics dashboards that turn browsers into buyers.',
    ctaText: 'Start Selling Online',
  },
  {
    id: 'ai',
    icon: Bot,
    title: 'AI &',
    titleBreak: 'Automation',
    description: 'Smart chatbots, workflow automation, and AI-powered tools to streamline your business.',
    features: ['AI Chatbots', 'Workflow Automation', 'Custom AI Tools'],
    variant: 'light',
    detailHeadline: 'Automate your business with intelligent AI solutions.',
    detailDescription: 'From smart chatbots that handle customer inquiries to workflow automations that save hours of manual work, we build AI-powered tools that let you focus on growth.',
    ctaText: 'Explore AI Solutions',
  },
  {
    id: 'landing',
    icon: FileText,
    title: 'Landing',
    titleBreak: 'Pages',
    description: 'High-converting campaign pages designed to capture leads and drive action.',
    features: ['A/B Testing Ready', 'Lead Capture Forms', 'Analytics Integration'],
    variant: 'lime',
  },
  {
    id: 'support',
    icon: Wrench,
    title: 'Maintenance &',
    titleBreak: 'Support',
    description: 'Ongoing updates, hosting management, performance monitoring, and technical support.',
    features: ['24/7 Monitoring', 'Regular Updates', 'Performance Optimization'],
    variant: 'dark',
  },
]
