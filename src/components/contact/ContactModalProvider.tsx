import { createContext, useState, useCallback, type ReactNode } from 'react'

export interface FormContext {
  subject: string
  source: string
}

export interface ContactModalContextType {
  isOpen: boolean
  context: FormContext | null
  openContactForm: (ctx: FormContext) => void
  closeContactForm: () => void
}

export const ContactModalContext =
  createContext<ContactModalContextType | null>(null)

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [context, setContext] = useState<FormContext | null>(null)

  const openContactForm = useCallback((ctx: FormContext) => {
    setContext(ctx)
    setIsOpen(true)
  }, [])

  const closeContactForm = useCallback(() => {
    setIsOpen(false)
    setContext(null)
  }, [])

  return (
    <ContactModalContext.Provider
      value={{ isOpen, context, openContactForm, closeContactForm }}
    >
      {children}
    </ContactModalContext.Provider>
  )
}
