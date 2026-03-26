import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { useContactModal } from '../../hooks/useContactModal'
import { useContactForm } from '../../hooks/useContactForm'

export function ContactModal() {
  const { t } = useTranslation()
  const { isOpen, context, closeContactForm } = useContactModal()
  const { fields, errors, status, updateField, handleSubmit, reset } =
    useContactForm(context)

  const handleClose = useCallback(() => {
    reset()
    closeContactForm()
  }, [reset, closeContactForm])

  useEffect(() => {
    if (!isOpen) return

    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, handleClose])

  if (!isOpen) return null

  const subject = context?.subject || 'general'
  const contextKey = subject === 'general' ? 'general' : subject
  const heading = t(`contactForm.contexts.${contextKey}.heading`)
  const description = t(`contactForm.contexts.${contextKey}.description`)

  const inputClass = (hasError: boolean) =>
    `w-full border-2 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#B9FF66] focus:border-[#B9FF66] ${
      hasError ? 'border-red-500' : 'border-black'
    }`

  const selectClass =
    'w-full border-2 border-black rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#B9FF66] focus:border-[#B9FF66] bg-white appearance-none'

  if (status === 'success') {
    return createPortal(
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/60"
          onClick={handleClose}
        />
        <div className="relative bg-white border-4 border-black rounded-[30px] p-8 lg:p-10 w-full max-w-lg brutalist-shadow text-center">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            <X size={24} strokeWidth={3} />
          </button>
          <h2 className="text-2xl lg:text-3xl font-black mb-4 text-green-600">
            {t('contactForm.success.heading')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('contactForm.success.description')}
          </p>
          <button
            onClick={handleClose}
            className="bg-[#B9FF66] border-4 border-black rounded-xl px-8 py-3 font-black text-lg hover:bg-[#a8e65c] transition-colors"
          >
            {t('contactForm.success.close')}
          </button>
        </div>
      </div>,
      document.body,
    )
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={handleClose}
      />
      <div className="relative bg-white border-4 border-black rounded-[30px] p-8 lg:p-10 w-full max-w-lg max-h-[90vh] overflow-y-auto brutalist-shadow">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <h2 className="text-2xl lg:text-3xl font-black mb-2">{heading}</h2>
        <p className="text-gray-600 mb-6">{description}</p>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">
              {t('contactForm.fields.name.label')} *
            </label>
            <input
              type="text"
              placeholder={t('contactForm.fields.name.placeholder')}
              value={fields.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={inputClass(!!errors.name)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">
              {t('contactForm.fields.email.label')} *
            </label>
            <input
              type="email"
              placeholder={t('contactForm.fields.email.placeholder')}
              value={fields.email}
              onChange={(e) => updateField('email', e.target.value)}
              className={inputClass(!!errors.email)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">
              {t('contactForm.fields.phone.label')}
            </label>
            <input
              type="tel"
              placeholder={t('contactForm.fields.phone.placeholder')}
              value={fields.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className={inputClass(false)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">
              {t('contactForm.fields.service.label')}
            </label>
            <select
              value={fields.service}
              onChange={(e) => updateField('service', e.target.value)}
              className={selectClass}
            >
              <option value="">{t('contactForm.fields.service.placeholder')}</option>
              <option value="web-development">{t('contactForm.fields.service.options.webDev')}</option>
              <option value="ecommerce">{t('contactForm.fields.service.options.ecommerce')}</option>
              <option value="seo">{t('contactForm.fields.service.options.seo')}</option>
              <option value="ai-automation">{t('contactForm.fields.service.options.ai')}</option>
              <option value="landing-page">{t('contactForm.fields.service.options.landing')}</option>
              <option value="maintenance">{t('contactForm.fields.service.options.maintenance')}</option>
              <option value="other">{t('contactForm.fields.service.options.other')}</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">
              {t('contactForm.fields.budget.label')}
            </label>
            <select
              value={fields.budget}
              onChange={(e) => updateField('budget', e.target.value)}
              className={selectClass}
            >
              <option value="">{t('contactForm.fields.budget.placeholder')}</option>
              <option value="under-500">{t('contactForm.fields.budget.options.under500')}</option>
              <option value="500-1500">{t('contactForm.fields.budget.options.500to1500')}</option>
              <option value="1500-5000">{t('contactForm.fields.budget.options.1500to5000')}</option>
              <option value="5000-plus">{t('contactForm.fields.budget.options.5000plus')}</option>
              <option value="not-sure">{t('contactForm.fields.budget.options.notSure')}</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold mb-1">
              {t('contactForm.fields.notes.label')} *
            </label>
            <textarea
              rows={4}
              placeholder={t('contactForm.fields.notes.placeholder')}
              value={fields.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              className={inputClass(!!errors.notes)}
            />
            {errors.notes && (
              <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
            )}
          </div>

          <input
            type="checkbox"
            name="botcheck"
            className="hidden"
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          {status === 'error' && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-4">
              <p className="font-bold text-red-700">
                {t('contactForm.error.heading')}
              </p>
              <p className="text-red-600 text-sm mt-1">
                {t('contactForm.error.description')}
              </p>
              <button
                type="button"
                onClick={handleSubmit}
                className="mt-2 text-sm font-bold text-red-700 underline hover:no-underline"
              >
                {t('contactForm.error.retry')}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-[#B9FF66] border-4 border-black rounded-xl py-3 font-black text-lg hover:bg-[#a8e65c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'submitting'
              ? t('contactForm.submitting')
              : t('contactForm.submit')}
          </button>

          <a
            href="https://www.cal.eu/epsystems"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-3 block text-center border-4 border-black rounded-xl py-3 font-black text-lg hover:bg-zinc-100 transition-colors"
          >
            {t('contactPage.bookCall.button', { defaultValue: 'Book a Call' })}
          </a>
        </form>
      </div>
    </div>,
    document.body,
  )
}
