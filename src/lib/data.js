// Shared mock data & helpers

export const STATS = {
  totalIndexed: 54820,
  predatoryFees: 412,
  typesquatDomains: 189,
  counselorTips: 84,
  flaggedHigh: 362,
  lastUpdated: '8 mins ago',
}

export const SCHOLARSHIPS = [
  {
    id: '1',
    name: 'Gates Millennium Scholars Program',
    org: 'Bill & Melinda Gates Foundation',
    url: 'gates-foundation.org',
    award: '$10,000',
    status: 'VERIFIED',
    threat: 2,
    domain: '26 years ago (Est. 1999)',
    irs: true,
    date: '2025-02-20',
    notes: ['$0 Filing Fee (Gold Standard)', 'Domain Registered 26 yrs ago (Est. 1999)', 'IRS 501(c)(3) Compliant'],
  },
  {
    id: '2',
    name: 'National Merit Excellence Grant 2025',
    org: 'National Merit Foundation — Fictitious Entity',
    url: 'national-meritscholars-portal.org',
    award: '$12,500',
    status: 'FRAUD',
    threat: 94,
    domain: '14 days (Privacy Protected VPS)',
    irs: false,
    date: '2025-06-01',
    notes: ['Demands $45 "Courier & Certificate Fee"', 'Domain Age: 14 Days (Privacy Protected VPS)', 'Subdomain request purported to routing registrar'],
  },
  {
    id: '3',
    name: 'STEM Future Leaders Tech Stipend',
    org: 'Acme Robotics Foundation',
    url: 'scholars-awards.ac',
    award: '$5,000',
    status: 'HIGH_RISK',
    threat: 81,
    domain: '6 hours (social ad campaign)',
    irs: false,
    date: '2025-02-25',
    notes: ['Demands $55 & Direct Deposit Prior to Selection', 'Contact: Free Webmail (Gmail.com)', 'Created 6 hrs ago via social ad campaign'],
  },
  {
    id: '4',
    name: 'Coca-Cola Scholars Foundation',
    org: 'The Coca-Cola Company',
    url: 'coca-colascholars foundation.org',
    award: '$50,000',
    status: 'VERIFIED',
    threat: 1,
    domain: 'Est. 1986',
    irs: true,
    date: '2025-02-20',
    notes: ['Gold Standard verified', 'National High School Counselor Endorsement Active'],
  },
  {
    id: '5',
    name: 'Ivy League Diversity Fellowship 2025',
    org: 'Unnamed Consortium Entity',
    url: 'ivy-ivyleague-fellowship.net',
    award: '$8,000',
    status: 'SUSPICIOUS',
    threat: 63,
    domain: 'Unknown',
    irs: false,
    date: '2025-02-02',
    notes: ['Flagging: Misleading University Grant Derivation', '"Only 5 allocations remaining — 6% left"', 'Under manual examiner review #6-12'],
  },
  {
    id: '6',
    name: 'Federal Pell Grant Program',
    org: 'U.S. Department of Education',
    url: 'studentaid.gov',
    award: 'Up to $7,395',
    status: 'VERIFIED',
    threat: 0,
    domain: 'Est. 1972',
    irs: true,
    date: '2025-01-01',
    notes: ['Official U.S. Government Program', '.gov domain — highest trust level', 'Apply via FAFSA only — no fee'],
  },
  {
    id: '7',
    name: 'NSF Graduate Research Fellowship',
    org: 'National Science Foundation',
    url: 'nsfgrfp.org',
    award: '$37,000/yr',
    status: 'VERIFIED',
    threat: 1,
    domain: 'Est. 1952',
    irs: true,
    date: '2025-01-15',
    notes: ['U.S. Federal Agency', 'No application fee', 'Peer-reviewed selection process'],
  },
  {
    id: '8',
    name: 'QuantumLeap STEM Scholarship 2025',
    org: 'QuantumLeap Education Initiative LLC',
    url: 'quantumleap-edu-scholarship.info',
    award: '$15,000',
    status: 'HIGH_RISK',
    threat: 78,
    domain: '3 weeks',
    irs: false,
    date: '2025-05-20',
    notes: ['$75 processing fee demanded upfront', 'No verifiable IRS 990 filing', 'Guarantees award without merit review', '.info TLD with 3-week domain age'],
  },
  {
    id: '9',
    name: 'Rhodes Scholarship',
    org: 'Rhodes Trust',
    url: 'rhodeshouse.ox.ac.uk',
    award: 'Full Oxford funding',
    status: 'VERIFIED',
    threat: 0,
    domain: 'Est. 1902',
    irs: true,
    date: '2025-01-01',
    notes: ['Established 1902', 'University of Oxford affiliated', 'No application fee'],
  },
  {
    id: '10',
    name: 'American Opportunity Credit Grant Initiative',
    org: 'American Grants Processing Bureau',
    url: 'american-opportunity-grants.net',
    award: '$9,500',
    status: 'FRAUD',
    threat: 91,
    domain: '8 days (NameCheap Privacy)',
    irs: false,
    date: '2025-06-05',
    notes: ['Mimics IRS AOTC program name', 'Requests SSN and bank routing number', 'Domain 8 days old with privacy', 'LLC shell — no academic staff'],
  },
]

export const SCAN_RESULT = {
  url: 'https://national-students-grant.biz/apply',
  threat: 91,
  status: 'FRAUD',
  critical: 4,
  caution: 1,
  cleared: 0,
  ref: '90-2025-99429-3',
  pillars: [
    {
      id: 'domain',
      label: 'Domain & WHOIS Integrity',
      status: 'CRITICAL',
      rows: [
        { label: 'Domain Age', value: '33 Days (High Risk < 180)', flag: true },
        { label: 'Registrar', value: 'NameCheap Privacy Proxy', flag: true },
        { label: 'SSL Cert Type', value: "Free Automated Let's Encrypt" },
        { label: 'TLD Risk', value: '.biz — High Risk TLD', flag: true },
      ],
    },
    {
      id: 'financial',
      label: 'Financial Extraction Demand',
      status: 'CRITICAL',
      rows: [
        { label: 'Fee Requested', value: '$95.00 USD', flag: true },
        { label: 'Disbursement Method', value: 'Zelle / QR Code', flag: true },
        { label: 'Federal Standard', value: '$0 — No Fees Ever' },
      ],
    },
    {
      id: 'plagiarism',
      label: 'Plagiarism & Content Mirrored',
      status: 'FAIL',
      rows: [
        { label: 'Lexical Match', value: '94.2% Exact Match', flag: true },
        { label: 'Original Source', value: 'Jane Reed Scholar. 2021' },
        { label: 'Similarity Hash', value: 'short_program_echo...', flag: true },
      ],
    },
    {
      id: 'entity',
      label: 'Entity & Tax Status Registry',
      status: 'FAIL',
      rows: [
        { label: 'IRS 990', value: 'Unestablished / No Records', flag: true },
        { label: 'State Registry', value: 'Commercial Maildrop (UPS Store)', flag: true },
        { label: 'Corp Filing', value: 'Disallowed LLC (2022)', flag: true },
      ],
    },
    {
      id: 'linguistic',
      label: 'Linguistic Coercion Markers',
      status: 'CAUTION',
      rows: [
        { label: 'Countdown Timer', value: 'Persistent: Coercion 2% loss', flag: true },
        { label: 'Guarantee Type', value: 'Unrealistic — Claims 100%', flag: true },
        { label: 'Coercion Index', value: 'High (346/348)' },
      ],
    },
    {
      id: 'maildrop',
      label: 'Entity Maildrop Location',
      status: 'FAIL',
      rows: [
        { label: 'Address', value: '1800 Granite Blvd, Washington DC', flag: true },
        { label: 'Zip Code', value: '20013', flag: true },
        { label: 'Verification', value: 'Zero academic staff on premise', flag: true },
      ],
    },
  ],
}

export const THREAT_PATTERNS = [
  {
    id: 'fee-trap',
    num: '01',
    title: 'The Application Fee / Processing Charge Trap',
    sub: 'Most Common Deception · $1,247 victims catalogued',
    desc: 'Scholarships requiring upfront fees ranging from $10 to $1,000+, claiming these are for "processing," "courier," or "certificate" costs. Legitimate scholarships are always free to apply.',
    color: 'border-red-300 bg-red-50',
    badgeColor: 'bg-red-700',
    examples: [
      { label: '$35 "Registration Fee"', risk: 'FRAUD' },
      { label: '$150 "Courier Fee"', risk: 'FRAUD' },
      { label: '$25 "Background Check"', risk: 'HIGH_RISK' },
      { label: '$0 (Legitimate)', risk: 'CLEAN' },
    ],
  },
  {
    id: 'domain',
    num: '02',
    title: 'Domain Mirroring, Homoglyphs & Free Cloud Hosting',
    sub: 'Technical Deception · 892 domains catalogued',
    desc: 'Scammers register domains that visually or phonetically mimic legitimate scholarship organizations, using homoglyphs (rn → m), hyphenation, or free hosting to appear credible.',
    color: 'border-orange-300 bg-orange-50',
    badgeColor: 'bg-orange-600',
    domains: [
      { fake: 'national-meritscholars-portal.org', real: 'nationalmerit.org', risk: 'FRAUD' },
      { fake: 'gates-milienniurn-scholars.info', real: 'gatesmillenniumscholars.org', risk: 'FRAUD' },
      { fake: 'nsf-grfp-applications.net', real: 'nsfgrfp.org', risk: 'HIGH_RISK' },
    ],
  },
  {
    id: 'guaranteed',
    num: '03',
    title: 'The "Guaranteed Winner" & Unrealistic Award Letter',
    sub: 'Psychological Deception · 634 cases',
    desc: 'Solicitations claiming pre-selection, guaranteed awards, or mimicking official financial aid award letters to harvest personal information or extract fees before "releasing" funds.',
    color: 'border-yellow-300 bg-yellow-50',
    badgeColor: 'bg-yellow-600',
  },
  {
    id: 'copied',
    num: '04',
    title: 'Copied Content, Stolen Prompts & Ghost Aggregators',
    sub: 'Content Theft · 445 cases',
    desc: 'Sites that copy entire scholarship descriptions from legitimate sources but substitute contact information and payment portals, or aggregate real scholarships alongside fake ones for credibility.',
    color: 'border-blue-300 bg-blue-50',
    badgeColor: 'bg-blue-700',
  },
  {
    id: 'shadow',
    num: '05',
    title: 'Shadow Organizations & Commercial Mail Receiving Agencies',
    sub: 'Identity Fraud · 318 cases',
    desc: 'Fake nonprofit organizations registered at UPS Store, Regus, or mail forwarding addresses, with no actual staff, board members, or programmatic activity beyond fee collection.',
    color: 'border-purple-300 bg-purple-50',
    badgeColor: 'bg-purple-700',
  },
]

export const MONTHLY_DATA = [
  { month: 'Jan', flagged: 28, verified: 142 },
  { month: 'Feb', flagged: 35, verified: 158 },
  { month: 'Mar', flagged: 42, verified: 171 },
  { month: 'Apr', flagged: 38, verified: 165 },
  { month: 'May', flagged: 55, verified: 189 },
  { month: 'Jun', flagged: 71, verified: 203 },
  { month: 'Jul', flagged: 63, verified: 195 },
  { month: 'Aug', flagged: 89, verified: 221 },
  { month: 'Sep', flagged: 102, verified: 234 },
  { month: 'Oct', flagged: 118, verified: 248 },
  { month: 'Nov', flagged: 134, verified: 267 },
]

export const VECTOR_BREAKDOWN = [
  { name: 'Application Fee', value: 34, color: '#dc2626' },
  { name: 'Domain Mirroring', value: 22, color: '#ea580c' },
  { name: 'ID Harvesting', value: 18, color: '#d97706' },
  { name: 'Fake Nonprofit', value: 14, color: '#7c3aed' },
  { name: 'Copied Content', value: 12, color: '#2563eb' },
]

// Helpers
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function threatColor(status) {
  const map = {
    FRAUD: 'badge-fraud',
    HIGH_RISK: 'badge-high-risk',
    SUSPICIOUS: 'badge-suspicious',
    CAUTION: 'badge-caution',
    VERIFIED: 'badge-verified',
    CLEAN: 'badge-verified',
  }
  return map[status] || 'badge-caution'
}

export function threatIndexColor(n) {
  if (n >= 80) return 'bg-red-600'
  if (n >= 60) return 'bg-orange-500'
  if (n >= 40) return 'bg-yellow-500'
  if (n >= 20) return 'bg-blue-500'
  return 'bg-green-500'
}

export function pillarStatusClass(s) {
  const map = {
    CRITICAL: 'pill-status-critical',
    FAIL: 'pill-status-fail',
    CAUTION: 'pill-status-caution',
    PASS: 'pill-status-pass',
  }
  return map[s] || 'pill-status-caution'
}

export function cardBorder(status) {
  const map = {
    FRAUD: 'border-red-300 bg-red-50/40',
    HIGH_RISK: 'border-orange-300 bg-orange-50/30',
    SUSPICIOUS: 'border-yellow-300 bg-yellow-50/20',
    CAUTION: 'border-amber-200 bg-amber-50/20',
    VERIFIED: 'border-gray-200 bg-white',
  }
  return map[status] || 'border-gray-200 bg-white'
}

export function fmt(n) {
  return n.toLocaleString('en-US')
}

