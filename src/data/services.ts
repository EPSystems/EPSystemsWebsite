import { Globe, Workflow, Bot, Search, ShoppingCart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  titleBreak: string;
  description: string;
  features: string[];
  variant: "light" | "lime" | "dark";
  detailHeadline?: string;
  detailDescription?: string;
  ctaText?: string;
}

export const services: Service[] = [
  {
    id: "aiWebsites",
    icon: Globe,
    title: "AI",
    titleBreak: "Websites",
    description:
      "A website that talks to your customers and turns visitors into leads.",
    features: [
      "Built-in AI chat and lead qualification",
      "Bilingual Bulgarian + English content",
      "AI-powered SEO head start",
    ],
    variant: "light",
  },
  {
    id: "aiAutomation",
    icon: Workflow,
    title: "AI",
    titleBreak: "Automation",
    description:
      "We automate the manual processes stealing hours from your week.",
    features: [
      "n8n + Claude API workflows",
      "Integrations with CRM, Gmail, Sheets, WhatsApp",
      "Clear ROI metrics before kickoff",
    ],
    variant: "lime",
  },
  {
    id: "aiAgents",
    icon: Bot,
    title: "AI",
    titleBreak: "Agents",
    description: "A custom AI employee that works 24/7 on your data.",
    features: [
      "Trained on your knowledge base",
      "Bulgarian + English language",
      "Human handoff for complex cases",
    ],
    variant: "dark",
  },
  {
    id: "aiSeo",
    icon: Search,
    title: "AI",
    titleBreak: "SEO",
    description: "More organic traffic without manually writing every article.",
    features: [
      "AI-generated articles with quality control",
      "Programmatic SEO at scale",
      "Technical audit + on-page optimization",
    ],
    variant: "light",
  },
  {
    id: "aiEcommerce",
    icon: ShoppingCart,
    title: "AI",
    titleBreak: "E-Commerce",
    description:
      "An online store with AI descriptions, recommendations, and support.",
    features: [
      "Shopify / WooCommerce + AI layer",
      "Personalized product recommendations",
      "24/7 AI customer support",
    ],
    variant: "lime",
  },
];
