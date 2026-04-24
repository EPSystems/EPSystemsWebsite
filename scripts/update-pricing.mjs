// One-shot: update the pricing band on each of the 5 AI service pages
// after Emo confirmed real figures during Phase 8 UAT. Safe to delete.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const BG = resolve(__dirname, '../src/i18n/locales/bg/common.json')
const EN = resolve(__dirname, '../src/i18n/locales/en/common.json')

const BG_FIGS = {
  'ai-websites':  { rangeLabel: 'От', range: '€300+' },
  'ai-automation': { rangeLabel: '', range: 'Заявете консултация' },
  'ai-agents':    { rangeLabel: 'От', range: '€500 + €49/мес' },
  'ai-seo':       { rangeLabel: 'От', range: '€300/мес' },
  'ai-ecommerce': { rangeLabel: 'От', range: '€500+' },
}

const EN_FIGS = {
  'ai-websites':  { rangeLabel: 'From', range: '€300+' },
  'ai-automation': { rangeLabel: '', range: 'Request a consultation' },
  'ai-agents':    { rangeLabel: 'From', range: '€500 + €49/mo' },
  'ai-seo':       { rangeLabel: 'From', range: '€300/mo' },
  'ai-ecommerce': { rangeLabel: 'From', range: '€500+' },
}

function apply(path, figs) {
  const json = JSON.parse(readFileSync(path, 'utf8'))
  for (const [slug, v] of Object.entries(figs)) {
    const p = json.servicePages?.[slug]?.pricing
    if (!p) throw new Error(`Missing pricing for ${slug} at ${path}`)
    p.rangeLabel = v.rangeLabel
    p.range = v.range
    p.flag = '' // Emo confirmed — no more REPLACE marker
  }
  writeFileSync(path, JSON.stringify(json, null, 2) + '\n', 'utf8')
}

apply(BG, BG_FIGS)
apply(EN, EN_FIGS)
console.log('Pricing updated for 5 services × 2 locales.')
