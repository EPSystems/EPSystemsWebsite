// One-shot: remove the orphan "projects" section from both locale files.
// The /projects route is commented out in App.tsx, so this data is dead
// weight. Safe to delete this script after merge.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const files = [
  resolve(__dirname, '../src/i18n/locales/bg/common.json'),
  resolve(__dirname, '../src/i18n/locales/en/common.json'),
]

for (const path of files) {
  const json = JSON.parse(readFileSync(path, 'utf8'))
  delete json.projects
  writeFileSync(path, JSON.stringify(json, null, 2) + '\n', 'utf8')
}
console.log('Removed orphan "projects" section from BG + EN locales.')
