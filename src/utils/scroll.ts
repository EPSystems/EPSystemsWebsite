/**
 * Smooth-scroll to a section by its element ID.
 * Falls back silently if the target element does not exist.
 */
export function scrollToSection(sectionId: string): void {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
}
