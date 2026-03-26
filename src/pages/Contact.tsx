import { useState, useEffect } from 'react'
import { useLanguageSync } from '../hooks/useLanguageSync'
import { usePageMeta } from '../hooks/usePageMeta'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { AnimatedSection } from '../components/ui/AnimatedSection'
import { useTranslation } from 'react-i18next'
import { useContactModal } from '../hooks/useContactModal'
import { useContactForm } from '../hooks/useContactForm'
import { Mail, Phone, MapPin, Clock, MessageCircle, ChevronDown, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function FAQItem({ questionKey, answerKey }: { questionKey: string; answerKey: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <div className="border-4 border-black rounded-2xl overflow-hidden brutalist-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-zinc-50 transition-colors"
      >
        <span className="text-lg font-black tracking-tight pr-4">
          {t(questionKey)}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={24} strokeWidth={3} className="text-[#B9FF66]" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-0 border-t-2 border-zinc-200">
              <p className="text-zinc-600 text-lg leading-relaxed pt-4">
                {t(answerKey)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Contact() {
  useLanguageSync()
  usePageMeta('contactPage.meta.title', 'contactPage.meta.description')
  const { t } = useTranslation()
  useContactModal() // keep provider active
  const { fields, errors, status, updateField, handleSubmit, reset } =
    useContactForm({ subject: 'general', source: 'contact-page' })

  const inputClass = (hasError: boolean) =>
    `w-full border-2 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#B9FF66] focus:border-[#B9FF66] ${
      hasError ? 'border-red-500' : 'border-black'
    }`

  const selectClass =
    'w-full border-2 border-black rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#B9FF66] focus:border-[#B9FF66] bg-white appearance-none'

  // Load Calendly widget script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const contactInfo = [
    { icon: Mail, labelKey: 'contactPage.info.email', value: 'hello@epsystems.bg', href: 'mailto:hello@epsystems.bg' },
    { icon: Phone, labelKey: 'contactPage.info.phone', value: '+359 879 503 151', href: 'tel:+359879503151' },
    { icon: MapPin, labelKey: 'contactPage.info.location', value: null },
    { icon: Clock, labelKey: 'contactPage.info.hours', value: null },
    { icon: MessageCircle, labelKey: 'contactPage.info.response', value: null },
  ]

  const faqItems = [
    { q: 'contactPage.faq.items.0.question', a: 'contactPage.faq.items.0.answer' },
    { q: 'contactPage.faq.items.1.question', a: 'contactPage.faq.items.1.answer' },
    { q: 'contactPage.faq.items.2.question', a: 'contactPage.faq.items.2.answer' },
    { q: 'contactPage.faq.items.3.question', a: 'contactPage.faq.items.3.answer' },
    { q: 'contactPage.faq.items.4.question', a: 'contactPage.faq.items.4.answer' },
  ]

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <AnimatedSection>
          <span className="inline-block bg-[#B9FF66] text-black text-sm font-black px-4 py-2 rounded-full border-2 border-black mb-6">
            {t('contactPage.hero.badge')}
          </span>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-6">
            {t('contactPage.hero.heading')}
          </h1>
          <p className="text-xl lg:text-2xl text-zinc-600 font-bold max-w-3xl leading-relaxed">
            {t('contactPage.hero.subheading')}
          </p>
        </AnimatedSection>
      </section>

      {/* Two-Column: Form + Contact Info */}
      <section className="bg-zinc-100 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* LEFT: Inline Contact Form */}
              <div className="bg-white border-4 border-black rounded-[30px] p-8 lg:p-10 brutalist-shadow">
                {status === 'success' ? (
                  <div className="text-center py-12">
                    <CheckCircle size={64} strokeWidth={2} className="text-green-600 mx-auto mb-6" />
                    <h2 className="text-2xl lg:text-3xl font-black mb-4 text-green-600">
                      {t('contactForm.success.heading')}
                    </h2>
                    <p className="text-gray-600 mb-8">
                      {t('contactForm.success.description')}
                    </p>
                    <button
                      onClick={reset}
                      className="bg-[#B9FF66] border-4 border-black rounded-xl px-8 py-3 font-black text-lg hover:bg-[#a8e65c] transition-colors"
                    >
                      {t('contactPage.form.sendAnother')}
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl lg:text-3xl font-black tracking-tight mb-2">
                      {t('contactPage.form.heading')}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {t('contactPage.form.description')}
                    </p>

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
                    </form>
                  </>
                )}
              </div>

              {/* RIGHT: Contact Info */}
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-black tracking-tight mb-6">
                    {t('contactPage.info.heading')}
                  </h2>
                  <div className="space-y-6">
                    {contactInfo.map(({ icon: Icon, labelKey, value, href }, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[#B9FF66] rounded-xl flex items-center justify-center border-2 border-black flex-shrink-0">
                          <Icon size={22} strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
                            {t(labelKey)}
                          </p>
                          {href ? (
                            <a
                              href={href}
                              className="text-lg font-black tracking-tight hover:text-[#7ab82e] transition-colors"
                            >
                              {value}
                            </a>
                          ) : (
                            <p className="text-lg font-bold text-zinc-800">
                              {t(`${labelKey}Value`)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Book a Call CTA */}
                <div className="bg-black rounded-[30px] border-4 border-black p-8 mt-auto">
                  <h3 className="text-2xl font-black tracking-tight text-white mb-3">
                    {t('contactPage.bookCall.heading')}
                  </h3>
                  <p className="text-zinc-400 font-bold mb-6">
                    {t('contactPage.bookCall.description')}
                  </p>
                  {/* [REPLACE: Set your Calendly URL below] */}
                  <a
                    href="https://calendly.com/[REPLACE-WITH-YOUR-CALENDLY-SLUG]/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#B9FF66] border-4 border-[#B9FF66] hover:bg-white hover:border-white text-black px-8 py-3 rounded-xl text-lg font-black transition-colors duration-300 tracking-tighter"
                  >
                    {t('contactPage.bookCall.button')}
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Calendly Embed */}
      {/* [REPLACE: Set your Calendly URL in the data-url attribute below] */}
      <section className="py-16 bg-zinc-100">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-center mb-8">
              {t('contactPage.calendly.heading', { defaultValue: 'Or book a free 30-minute call' })}
            </h2>
            <div
              className="calendly-inline-widget rounded-[30px] overflow-hidden border-4 border-black"
              data-url="https://calendly.com/[REPLACE-WITH-YOUR-CALENDLY-SLUG]/30min"
              style={{ minWidth: '320px', height: '700px' }}
            />
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-12">
              {t('contactPage.faq.heading')}
            </h2>
            <div className="max-w-3xl space-y-4">
              {faqItems.map(({ q, a }, i) => (
                <FAQItem key={i} questionKey={q} answerKey={a} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </>
  )
}
