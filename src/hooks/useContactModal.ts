import { useContext } from 'react'
import { ContactModalContext } from '../components/contact/ContactModalProvider'

export function useContactModal() {
  const context = useContext(ContactModalContext)
  if (!context) {
    throw new Error('useContactModal must be used within ContactModalProvider')
  }
  return context
}
