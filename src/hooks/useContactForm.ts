import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import type { FormContext } from '../components/contact/ContactModalProvider'

interface FormFields {
  name: string
  email: string
  phone: string
  service: string
  budget: string
  notes: string
}

interface FormErrors {
  name: string
  email: string
  notes: string
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const initialFields: FormFields = { name: '', email: '', phone: '', service: '', budget: '', notes: '' }
const initialErrors: FormErrors = { name: '', email: '', notes: '' }

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function useContactForm(formContext: FormContext | null) {
  const { t } = useTranslation()
  const [fields, setFields] = useState<FormFields>(initialFields)
  const [errors, setErrors] = useState<FormErrors>(initialErrors)
  const [status, setStatus] = useState<FormStatus>('idle')

  const updateField = useCallback(
    (field: keyof FormFields, value: string) => {
      setFields((prev) => ({ ...prev, [field]: value }))
      if (field in errors) {
        setErrors((prev) => ({ ...prev, [field]: '' }))
      }
    },
    [errors],
  )

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = { name: '', email: '', notes: '' }
    let valid = true

    if (!fields.name.trim()) {
      newErrors.name = t('contactForm.validation.nameRequired')
      valid = false
    }

    if (!fields.email.trim()) {
      newErrors.email = t('contactForm.validation.emailRequired')
      valid = false
    } else if (!EMAIL_REGEX.test(fields.email)) {
      newErrors.email = t('contactForm.validation.emailInvalid')
      valid = false
    }

    if (!fields.notes.trim()) {
      newErrors.notes = t('contactForm.validation.notesRequired')
      valid = false
    }

    setErrors(newErrors)
    return valid
  }, [fields, t])

  const handleSubmit = useCallback(async () => {
    if (!validate()) return

    setStatus('submitting')

    try {
      const subject =
        formContext?.subject === 'general'
          ? 'General Inquiry'
          : `${formContext?.subject} Inquiry`

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY,
          name: fields.name,
          email: fields.email,
          phone: fields.phone || undefined,
          service_interest: fields.service || undefined,
          budget_range: fields.budget || undefined,
          message: fields.notes,
          subject,
          from_name: 'E&P Systems Website',
          botcheck: false,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus('success')
        setFields(initialFields)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }, [fields, formContext, validate])

  const reset = useCallback(() => {
    setFields(initialFields)
    setErrors(initialErrors)
    setStatus('idle')
  }, [])

  return { fields, errors, status, updateField, handleSubmit, reset }
}
