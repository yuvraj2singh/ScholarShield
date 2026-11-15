const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const INITIAL_SCHOLARSHIPS = [
  {
    name: 'Gates Millennium Scholars Program',
    org: 'Bill & Melinda Gates Foundation',
    url: 'gates-foundation.org',
    award: '$10,000',
    status: 'VERIFIED',
    threatIndex: 2,
    domain: '26 years ago (Est. 1999)',
    irsCompliant: true,
    notes: ['$0 Filing Fee (Gold Standard)', 'Domain Registered 26 yrs ago (Est. 1999)', 'IRS 501(c)(3) Compliant'],
    vectors: [],
  },
  {
    name: 'National Merit Excellence Grant 2025',
    org: 'National Merit Foundation — Fictitious Entity',
    url: 'national-meritscholars-portal.org',
    award: '$12,500',
    status: 'FRAUD',
    threatIndex: 94,
    domain: '14 days (Privacy Protected VPS)',
    irsCompliant: false,
    notes: ['Demands $45 "Courier & Certificate Fee"', 'Domain Age: 14 Days (Privacy Protected VPS)', 'Subdomain request purported to routing registrar'],
    vectors: ['fee-trap', 'domain', 'guaranteed'],
  },
  {
    name: 'STEM Future Leaders Tech Stipend',
    org: 'Acme Robotics Foundation',
    url: 'scholars-awards.ac',
    award: '$5,000',
    status: 'HIGH_RISK',
    threatIndex: 81,
    domain: '6 hours (social ad campaign)',
    irsCompliant: false,
    notes: ['Demands $55 & Direct Deposit Prior to Selection', 'Contact: Free Webmail (Gmail.com)', 'Created 6 hrs ago via social ad campaign'],
    vectors: ['fee-trap', 'shadow'],
  },
  {
    name: 'Coca-Cola Scholars Foundation',
    org: 'The Coca-Cola Company',
    url: 'coca-colascholarsfoundation.org',
    award: '$50,000',
    status: 'VERIFIED',
    threatIndex: 1,
    domain: 'Est. 1986',
    irsCompliant: true,
    notes: ['Gold Standard verified', 'National High School Counselor Endorsement Active'],
    vectors: [],
  },
  {
    name: 'Ivy League Diversity Fellowship 2025',
    org: 'Unnamed Consortium Entity',
    url: 'ivy-ivyleague-fellowship.net',
    award: '$8,000',
    status: 'SUSPICIOUS',
    threatIndex: 63,
    domain: 'Unknown',
    irsCompliant: false,
    notes: ['Flagging: Misleading University Grant Derivation', '"Only 5 allocations remaining — 6% left"', 'Under manual examiner review #6-12'],
    vectors: ['guaranteed', 'domain'],
  },
  {
    name: 'Federal Pell Grant Program',
    org: 'U.S. Department of Education',
    url: 'studentaid.gov',
    award: 'Up to $7,395',
    status: 'VERIFIED',
    threatIndex: 0,
    domain: 'Est. 1972',
    irsCompliant: true,
    notes: ['Official U.S. Government Program', '.gov domain — highest trust level', 'Apply via FAFSA only — no fee'],
    vectors: [],
  },
  {
    name: 'NSF Graduate Research Fellowship',
    org: 'National Science Foundation',
    url: 'nsfgrfp.org',
    award: '$37,000/yr',
    status: 'VERIFIED',
    threatIndex: 1,
    domain: 'Est. 1952',
    irsCompliant: true,
    notes: ['U.S. Federal Agency', 'No application fee', 'Peer-reviewed selection process'],
    vectors: [],
  },
  {
    name: 'QuantumLeap STEM Scholarship 2025',
    org: 'QuantumLeap Education Initiative LLC',
    url: 'quantumleap-edu-scholarship.info',
    award: '$15,000',
    status: 'HIGH_RISK',
    threatIndex: 78,
    domain: '3 weeks',
    irsCompliant: false,
    notes: ['$75 processing fee demanded upfront', 'No verifiable IRS 990 filing', 'Guarantees award without merit review', '.info TLD with 3-week domain age'],
    vectors: ['fee-trap', 'domain', 'shadow'],
  },
  {
    name: 'Rhodes Scholarship',
    org: 'Rhodes Trust',
    url: 'rhodeshouse.ox.ac.uk',
    award: 'Full Oxford funding',
    status: 'VERIFIED',
    threatIndex: 0,
    domain: 'Est. 1902',
    irsCompliant: true,
    notes: ['Established 1902', 'University of Oxford affiliated', 'No application fee'],
    vectors: [],
  },
  {
    name: 'American Opportunity Credit Grant Initiative',
    org: 'American Grants Processing Bureau',
    url: 'american-opportunity-grants.net',
    award: '$9,500',
    status: 'FRAUD',
    threatIndex: 91,
    domain: '8 days (NameCheap Privacy)',
    irsCompliant: false,
    notes: ['Mimics IRS AOTC program name', 'Requests SSN and bank routing number', 'Domain 8 days old with privacy', 'LLC shell — no academic staff'],
    vectors: ['fee-trap', 'domain', 'copied'],
  },
]

async function main() {
  console.log('🌱 Starting Prisma database seeding...')

  // Seed default analyst
  await prisma.analyst.upsert({
    where: { email: 'admin@scholarguard.org' },
    update: {},
    create: {
      name: 'Dr. Elena Vance, MLS',
      email: 'admin@scholarguard.org',
      role: 'Chief Compliance Officer',
      avatar: 'EV',
      casesTotal: 142,
      casesDone: 138,
    },
  })
  console.log('  ✅ Default analyst seeded')

  // Seed scholarships
  for (const item of INITIAL_SCHOLARSHIPS) {
    const existing = await prisma.scholarship.findFirst({ where: { url: item.url } })
    if (!existing) {
      await prisma.scholarship.create({ data: item })
    }
  }
  console.log(`  ✅ ${INITIAL_SCHOLARSHIPS.length} scholarships seeded`)

  console.log('✨ Prisma database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
