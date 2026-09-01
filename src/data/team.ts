// Structured team data. Display strings (name, role, bio) live in the i18n
// bundles under `team.members.<id>.*` so they stay localizable; this file
// carries the non-localizable identity fields (slug, photo, social links)
// and the link to the static Person JSON-LD `@id` in index.html.
//
// Slugs for member3/member4 are placeholders — replace with real full-name
// slugs once confirmed (USER track A3.2). The TeamMember page works for all
// members regardless; only the slug needs correcting later.

export interface TeamMember {
  /** i18n key used as the member identity: `team.members.<id>.{name,role,bio}`. */
  id: string
  /** URL slug for `/:lang/about/team/:slug`. */
  slug: string
  /** Fallback initials shown when no photo is available. */
  initials: string
  /** Headshot path under /public. */
  photo?: string
  /** Optional CSS object-position for the headshot crop. */
  photoPosition?: string
  /** LinkedIn profile URL → feeds Person.sameAs. Fill via USER track A1.8. */
  linkedin?: string
  /** Author name as it appears in blog frontmatter, used to link a post's byline. */
  authorName?: string
  /**
   * The `@id` of the standalone Person JSON-LD block in index.html, if one
   * exists (currently only the two founders). When set, the TeamMember page
   * references the canonical Person entity instead of declaring a new one.
   */
  personId?: string
}

export const teamMembers: TeamMember[] = [
  {
    id: 'member1',
    slug: 'emil-dermendzhiev',
    initials: 'ED',
    photo: '/team/emil.webp',
    linkedin: undefined, // TODO(A1.8): founder LinkedIn URL
    authorName: 'Emil Dermendzhiev',
    personId: 'https://www.epsystems.org/#person-emil',
  },
  {
    id: 'member2',
    slug: 'pavel-stefanov',
    initials: 'PS',
    photo: '/team/pavel.webp',
    linkedin: undefined, // TODO(A1.8): founder LinkedIn URL
    authorName: 'Pavel Stefanov',
    personId: 'https://www.epsystems.org/#person-pavel',
  },
  {
    id: 'member3',
    slug: 'emi-letkova',
    initials: 'EL',
    photo: '/team/emi.webp',
    linkedin: undefined,
  },
  {
    id: 'member4',
    slug: 'yoana-todorova',
    initials: 'YT',
    photo: '/team/yoana.webp',
    photoPosition: 'center 20%',
    linkedin: undefined,
  },
]

/** Resolve a team member by its URL slug. */
export function getTeamMember(slug: string): TeamMember | undefined {
  return teamMembers.find((m) => m.slug === slug)
}

/** Resolve a team member by the author name as it appears in blog frontmatter. */
export function getTeamMemberByAuthorName(name: string): TeamMember | undefined {
  return teamMembers.find((m) => m.authorName === name)
}
