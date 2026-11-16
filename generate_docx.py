import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_report(output_path, screenshots_dir):
    doc = Document()

    # Set page margins (0.75 in)
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Styles
    styles = doc.styles
    normal_style = styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(0x22, 0x22, 0x22)

    # ─── COVER / TITLE ───
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(36)
    title_p.paragraph_format.space_after = Pt(8)
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_badge = title_p.add_run("ACADEMIC PROJECT REPORT • SEMESTER 5\n")
    run_badge.font.size = Pt(11)
    run_badge.font.bold = True
    run_badge.font.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)

    run_title = title_p.add_run("ScholarShield (ScholarGuard)\n")
    run_title.font.size = Pt(26)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    run_sub = title_p.add_run("Autonomous Scholarship Fraud Detection & Forensic Verification Clearinghouse")
    run_sub.font.size = Pt(14)
    run_sub.font.italic = True
    run_sub.font.color.rgb = RGBColor(0x47, 0x55, 0x69)

    doc.add_paragraph().paragraph_format.space_after = Pt(24)

    # Meta Box Table
    meta_table = doc.add_table(rows=4, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Project Domain:", "Cybersecurity, Academic Anti-Fraud & Full-Stack Web Systems"),
        ("Technology Stack:", "Next.js 14 (App Router), React 18, Python FastAPI, Node.js Express, MongoDB, Prisma ORM"),
        ("Team Members:", "Himanshu Kumar & Yuvraj Singh"),
        ("Repository & Status:", "https://github.com/yuvraj2singh/ScholarShield (Production Ready)"),
    ]
    for i, (label, val) in enumerate(meta_data):
        row = meta_table.rows[i]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(2.0)
        c1.width = Inches(4.8)
        c0.paragraphs[0].add_run(label).bold = True
        c0.paragraphs[0].runs[0].font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
        c1.paragraphs[0].add_run(val)
        set_cell_background(c0, "F1F5F9")
        set_cell_background(c1, "F8FAFC")
        set_cell_margins(c0, 120, 120, 150, 150)
        set_cell_margins(c1, 120, 120, 150, 150)

    doc.add_page_break()

    # Helper for headings
    def add_section_header(num, title):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(20)
        h.paragraph_format.space_after = Pt(6)
        h.paragraph_format.keep_with_next = True
        r = h.add_run(f"{num}. {title}")
        r.font.size = Pt(16)
        r.font.bold = True
        r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
        # Add thin line below header
        pBrd = parse_xml(f'<w:pBrd {nsdecls("w")}><w:bottom w:val="single" w:sz="8" w:space="4" w:color="2563EB"/></w:pBrd>')
        h._p.get_or_add_pPr().append(pBrd)
        return h

    # ─── 1. PROJECT TITLE ───
    add_section_header("1", "Project Title")
    p = doc.add_paragraph()
    p.add_run("ScholarShield (ScholarGuard) — Autonomous Scholarship Verification & Anti-Fraud Clearinghouse\n").bold = True
    p.add_run(
        "A full-stack cybersecurity and academic integrity platform engineered to combat tuition fraud, "
        "lookalike phishing domains, advance-fee exploitation schemes, and student identity theft."
    )

    # ─── 2. PROBLEM STATEMENT ───
    add_section_header("2", "Problem Statement")
    doc.add_paragraph(
        "Every academic admissions cycle, millions of higher education applicants and low-income students "
        "seek external merit and need-based grants to finance college tuition. However, cybercriminals and "
        "predatory commercial syndicates aggressively exploit this demographic through sophisticated digital schemes:"
    )
    bullet_points = [
        ("Advance-Fee Fraud Traps: ", "Malicious operators demand upfront 'registration fees', 'courier charges', or 'disbursement processing fees' ($35–$150) under the false guarantee that financial aid is pre-approved."),
        ("Lookalike & Homoglyph Phishing Attacks: ", "Bad actors register typo-squatted domains and substitute visually indistinguishable characters (homoglyphs, e.g., 'rn' for 'm') using disposable high-risk TLDs (.biz, .info, .xyz) to mimic prestigious institutions like the Gates Foundation or National Merit Scholarship."),
        ("PII & Financial Credential Harvesting: ", "Unregulated online scholarship portals solicit sensitive student information—including Social Security Numbers (SSNs), bank routing numbers, FAFSA credentials, and government IDs—which are packaged and sold into black-market identity broker networks."),
        ("Critical Lack of Verification Infrastructure: ", "Students, parents, and high school counselors currently have no centralized, authoritative clearinghouse to instantly verify legal 501(c)(3) tax exemption, registrar domain age, and historic scam alerts.")
    ]
    for b_title, b_desc in bullet_points:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(4)
        r_bt = bp.add_run(b_title)
        r_bt.bold = True
        r_bt.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
        bp.add_run(b_desc)

    # ─── 3. PROJECT OBJECTIVE ───
    add_section_header("3", "Project Objective")
    doc.add_paragraph(
        "The central objective of ScholarShield is to establish an open, authoritative, and automated digital clearinghouse "
        "that provides multi-tiered forensic audits and public threat intelligence against scholarship fraud."
    )
    obj_points = [
        ("Real-Time Domain & Registrar Inspection: ", "Query live WHOIS records to detect domain registration age (<180 days probationary risk), identify offshore proxy privacy shields, and uncover high-risk top-level domains."),
        ("Multi-Pillar Lexical & Heuristic Auditing: ", "Apply Natural Language Processing and regex heuristics across scholarship portals to isolate coercive psychological markers and unsanctioned peer-to-peer payment requests (Zelle, Venmo, Crypto)."),
        ("Authoritative Registry & Verification Database: ", "Maintain a transparent database of legitimate academic endowments vetted against IRS 990 nonprofit filings, contrasted against confirmed threat dossiers."),
        ("Citizen Reporting & Regulatory Escalation: ", "Provide students and counselors with a structured 4-step scam reporting intake protocol, calculating threat priority scores for manual compliance analyst review."),
        ("Interactive Student Security Education: ", "Equip vulnerable applicants with educational tools, including dynamic Recharts threat taxonomies, scam anatomy breakdowns, and an interactive scholarship literacy quiz.")
    ]
    for b_title, b_desc in obj_points:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(4)
        r_bt = bp.add_run(b_title)
        r_bt.bold = True
        r_bt.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
        bp.add_run(b_desc)

    # ─── 4. FEATURES IMPLEMENTED ───
    add_section_header("4", "Features Implemented")
    features_table = doc.add_table(rows=1, cols=3)
    features_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr = features_table.rows[0].cells
    hdr[0].width = Inches(1.8)
    hdr[1].width = Inches(1.8)
    hdr[2].width = Inches(3.2)
    hdr[0].paragraphs[0].add_run("Module / Page").bold = True
    hdr[1].paragraphs[0].add_run("Core Capability").bold = True
    hdr[2].paragraphs[0].add_run("Technical Implementation & Value").bold = True
    for c in hdr:
        set_cell_background(c, "1E3A8A")
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        set_cell_margins(c, 100, 100, 120, 120)

    feature_rows = [
        ("Forensic Scanner (/scanner)", "Multi-Pillar Audit", "Computes composite Threat Index (0–100) across 4 vectors: Domain Age, Fee Traps, Coercion Language, and Identity Harvesting."),
        ("Diagnostic Presets", "One-Click Benchmark", "Pre-configured test payloads allowing instant demonstration of verified government aid (.gov) vs. confirmed malicious lookalikes."),
        ("Public Directory (/ & /registry)", "Searchable Registry", "High-density catalog with live status filtering (VERIFIED, CAUTION, SUSPICIOUS, HIGH_RISK, FRAUD) and threat meters."),
        ("Quick Verifier (/verify)", "Instant Safety Badge", "Lightweight single-field URL checker for mobile devices delivering immediate risk classification and student guidance."),
        ("Threat Intelligence (/threats)", "Data Visualization & Quiz", "Interactive Recharts line and donut charts tracking scam volume, threat vector distributions, and a 5-question awareness quiz."),
        ("Scam Intake Portal (/report)", "Citizen Incident Triage", "Multi-stage React Hook Form capturing evidence, payment methods, and financial losses with tracking IDs (RPT-XXXXXX)."),
        ("Analyst Portal (/admin)", "Case Management RBAC", "Internal dashboard for compliance officers to triage submissions, update investigation statuses, and manage domain blacklists."),
        ("Live Telemetry Header", "Global Sync Indicator", "Persistent ticker displaying active indexed scholarship counts, flagged high-risk entities, and nominal sync states."),
        ("Dual-Engine Backend", "Polyglot Microservices", "Dual sidecars in Python FastAPI (port 8000) and Node.js Express (port 8000/8002) with live WHOIS queries and web scraping.")
    ]
    for cat, name, desc in feature_rows:
        row = features_table.add_row().cells
        row[0].width = Inches(1.8)
        row[1].width = Inches(1.8)
        row[2].width = Inches(3.2)
        row[0].paragraphs[0].add_run(cat).bold = True
        row[1].paragraphs[0].add_run(name)
        row[2].paragraphs[0].add_run(desc)
        for idx, c in enumerate(row):
            set_cell_background(c, "F8FAFC" if idx % 2 == 0 else "FFFFFF")
            set_cell_margins(c, 80, 80, 100, 100)

    doc.add_page_break()

    # ─── 5. TECHNOLOGIES USED ───
    add_section_header("5", "Technologies Used & Architecture")
    doc.add_paragraph(
        "ScholarShield employs a high-performance modern web architecture combining Next.js 14 serverless capabilities "
        "with asynchronous forensic backend sidecars and robust transactional persistence:"
    )
    tech_categories = [
        ("Frontend Application Layer: ", "Next.js 14 (App Router), React 18, Tailwind CSS v3.4, PostCSS, Framer Motion for animations."),
        ("Data Visualization & UI Components: ", "Recharts v2.12 (Area and Pie/Donut threat distribution charts), Lucide React (vector iconography), React Hook Form v7.52."),
        ("Database & Persistence Layer: ", "MongoDB Community Server v9.0.4 configured as a single-node Replica Set ('rs0') to satisfy Prisma transactional requirements. Prisma ORM v5.18.0 with ObjectId mapping."),
        ("Authentication & Access Control: ", "NextAuth.js v4.24 with custom CredentialsProvider and JSON Web Token (JWT) session cookies."),
        ("Python Forensic Sidecar (:8000): ", "Python 3.9, FastAPI v0.111, Uvicorn, python-whois, HTTPX (async HTTP client), BeautifulSoup4 (HTML parser), Pydantic v2.7."),
        ("Node.js Forensic Sidecar (:8000/8002): ", "Node.js v26, Express.js v4.21, Axios v1.7, Cheerio v1.0, whois-json v2.0, CORS."),
        ("Hosting & Target Deployment: ", "Vercel Serverless Edge Platform for Next.js, with local and cloud container execution.")
    ]
    for t_cat, t_desc in tech_categories:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(4)
        r_bt = bp.add_run(t_cat)
        r_bt.bold = True
        r_bt.font.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)
        bp.add_run(t_desc)

    # ─── 6. REACT.JS CONCEPTS USED ───
    add_section_header("6", "React.js Concepts Used")
    doc.add_paragraph(
        "The frontend leverages modern React 18 paradigms and Next.js 14 App Router patterns to deliver optimal performance, "
        "interactivity, and type-safe state coordination:"
    )
    react_concepts = [
        ("Server Components (RSC) vs. Client Components: ", "Strict architectural boundary using the 'use client' directive for interactive views (e.g. ScannerForm, ThreatsClient, ReportForm) while maintaining pure Server Components for static layouts and initial data hydration to optimize First Contentful Paint."),
        ("State Management Hooks (useState, useReducer): ", "Utilized across components to track active filter tabs, audit output payloads, benchmark configurations, and multi-stage form progress."),
        ("Side-Effect Synchronization (useEffect): ", "Coordinated dynamic telemetry timers, URL search parameter synchronization, and automated backend health polling."),
        ("Performance Optimization (useMemo, useCallback): ", "Applied useMemo to memoize multi-attribute search filtering across large scholarship collections, preventing unnecessary CPU recalculations during real-time user typing."),
        ("Form State Management via Custom Hook (useForm): ", "Structured complex 4-step reporting workflows with React Hook Form, enforcing strict validation schemas, dirty state tracking, and sanitized error states."),
        ("Context API & Providers (AuthProvider): ", "Encapsulated global authentication state using NextAuth SessionProvider, injecting user identity and RBAC analyst privileges across the component tree."),
        ("Declarative Navigation Hooks (useRouter, usePathname, useSearchParams): ", "Employed App Router hooks for seamless client-side page routing, tab selection persistence, and bookmarkable search URLs."),
        ("Suspense Boundaries & Fallback Skeletons: ", "Configured Next.js loading.jsx skeletons and React <Suspense> boundaries to provide polished streaming feedback during asynchronous operations."),
        ("Atomic Component Composition: ", "Modularized the user interface into discrete, self-contained functional components (RegistryHero, StatsBar, SearchToolbar, ScholarshipList, ForensicSidebar) enhancing maintainability.")
    ]
    for r_title, r_desc in react_concepts:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(4)
        r_bt = bp.add_run(r_title)
        r_bt.bold = True
        r_bt.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
        bp.add_run(r_desc)

    doc.add_page_break()

    # ─── 7. APPLICATION SCREENSHOTS ───
    add_section_header("7", "Application Screenshots")
    doc.add_paragraph(
        "Below are production screenshots captured directly from the running ScholarShield application interface:"
    )

    screens = [
        ("home.png", "Figure 1: Public Scholarship Registry (Homepage)", "Displays live telemetry banner, statistical counter cards, search toolbar, and scholarship cards showing threat indices and verification statuses."),
        ("scanner.png", "Figure 2: Forensic URL & Domain Scanner (/scanner)", "Interactive forensic scanning suite with multi-pillar diagnostic breakdown, homoglyph risk flags, and one-click diagnostic test presets."),
        ("threats.png", "Figure 3: Threat Pattern Intelligence (/threats)", "Interactive Recharts visualizer depicting monthly scam incident volumes, threat vector breakdown, and student scam awareness quiz."),
        ("registry.png", "Figure 4: Full Database Registry Explorer (/registry)", "Structured data table presenting audit references, IRS 501(c)(3) compliance checks, domain registration age, and threat levels."),
        ("report.png", "Figure 5: Scam Report & Evidence Intake (/report)", "4-stage intake form capturing scam vectors, financial loss amounts, payment channels, and regulatory escalation guidance."),
        ("verify.png", "Figure 6: Instant Quick Link Verifier (/verify)", "Minimalist, mobile-optimized link checker delivering instant safety ratings, threat vector pills, and verification guidance."),
        ("admin.png", "Figure 7: Analyst & Admin Case Management (/admin)", "Secure compliance dashboard for reviewing submitted scam reports, triaging priorities, and updating investigation statuses.")
    ]

    for fname, caption, desc in screens:
        img_path = os.path.join(screenshots_dir, fname)
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(8)
            p_img.paragraph_format.space_after = Pt(4)
            p_img.paragraph_format.keep_with_next = True
            doc.add_picture(img_path, width=Inches(6.2))

            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_after = Pt(12)
            run_cap = p_cap.add_run(f"{caption}\n")
            run_cap.bold = True
            run_cap.font.size = Pt(10)
            run_cap.font.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)

            run_desc = p_cap.add_run(desc)
            run_desc.italic = True
            run_desc.font.size = Pt(9.5)
            run_desc.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

    doc.add_page_break()

    # ─── 8. PROJECT STRUCTURE ───
    add_section_header("8", "Project Structure")
    doc.add_paragraph("An overview of the codebase organization and repository hierarchy:")

    struct_text = (
        "ScholarShield/\n"
        "├── .env / .env.example              # Environment variables (DATABASE_URL, ANALYSIS_ENGINE_URL)\n"
        "├── package.json                     # Frontend dependencies, build & database scripts\n"
        "├── next.config.js                   # Next.js 14 App Router runtime configuration\n"
        "├── tailwind.config.js               # Clearinghouse color palette & UI styling system\n"
        "├── start.sh                         # Multi-service launcher (Python FastAPI + Next.js)\n"
        "│\n"
        "├── prisma/                          # Database Definition Layer\n"
        "│   ├── schema.prisma                # MongoDB models: Scholarship, ScanReport, ScamReport, Analyst, Watchlist\n"
        "│   └── seed.js                      # Database seed pipeline with verified and fraudulent benchmarks\n"
        "│\n"
        "├── backend/                         # Dedicated Forensic Analysis Engines\n"
        "│   ├── main.py                      # Python FastAPI engine (WHOIS lookup, BS4 scraping, NLP regex)\n"
        "│   ├── requirements.txt             # Python microservice dependencies\n"
        "│   └── node_backend/                # Standalone Node.js Express engine (1:1 behavioral parity)\n"
        "│       ├── server.js                # Express REST API (/health, /analyze/url, /analyze/text, /analyze/entity)\n"
        "│       ├── package.json             # Express, Axios, Cheerio, WHOIS-JSON dependencies\n"
        "│       └── README.md                # Independent test and run guide\n"
        "│\n"
        "├── public/                          # Static Assets & Screenshots\n"
        "│   ├── favicon.svg                  # Brand SVG shield icon\n"
        "│   └── screenshots/                 # Captured production application screenshots\n"
        "│\n"
        "└── src/\n"
        "    ├── app/                         # Next.js 14 App Router (Pages & API Routes)\n"
        "    │   ├── layout.jsx               # Root layout (TelemetryBar + NavbarClient + SiteFooter)\n"
        "    │   ├── page.jsx                 # Public Scholarship Registry (Home)\n"
        "    │   ├── scanner/page.jsx         # Forensic URL & Text Scanner Page\n"
        "    │   ├── threats/page.jsx         # Threat Intelligence & Awareness Quiz\n"
        "    │   ├── report/page.jsx          # Scam Reporting Intake Protocol\n"
        "    │   ├── registry/page.jsx        # Full Database Explorer\n"
        "    │   ├── verify/page.jsx          # Quick Link Verifier\n"
        "    │   ├── admin/page.jsx           # Investigator Case Management Portal\n"
        "    │   ├── admin/login/page.jsx     # Analyst Credentials Login Gateway\n"
        "    │   └── api/                     # Backend API Route Handlers\n"
        "    │       ├── scan/route.js        # Hybrid scanning engine & database audit logger\n"
        "    │       ├── scholarships/route.js# Filtered & paginated scholarship queries\n"
        "    │       ├── report/route.js      # Student report submission & priority calculator\n"
        "    │       ├── stats/route.js       # Live clearinghouse telemetry metrics\n"
        "    │       └── auth/[...nextauth]/  # NextAuth session route handler\n"
        "    │\n"
        "    ├── components/                  # Modular React 18 UI Components\n"
        "    │   ├── layout/                  # NavbarClient, SiteFooter, TelemetryBar\n"
        "    │   ├── registry/                # RegistryHero, StatsBar, SearchToolbar, ScholarshipList, ForensicSidebar\n"
        "    │   ├── scanner/                 # ScannerForm, DiagnosticBenchmark\n"
        "    │   ├── threats/                 # ThreatsClient (Recharts charts & threat accordions)\n"
        "    │   ├── report/                  # ReportForm (React Hook Form), ReportSidebar\n"
        "    │   ├── verify/                  # VerifyClient (Instant URL checker)\n"
        "    │   ├── admin/                   # AdminClient (Case triage table)\n"
        "    │   └── auth/                    # AuthProvider (NextAuth Session wrapper)\n"
        "    │\n"
        "    └── lib/                         # Core Utilities & Shared Logic\n"
        "        ├── db.js                    # Prisma client singleton instance\n"
        "        ├── actions.js               # Server Actions for DB queries and mutations\n"
        "        └── data.js                  # Benchmark scholarships, threat vectors, quiz data, mock fallback"
    )

    p_struct = doc.add_paragraph()
    p_struct.paragraph_format.left_indent = Inches(0.2)
    p_struct.paragraph_format.right_indent = Inches(0.2)
    run_s = p_struct.add_run(struct_text)
    run_s.font.name = 'Consolas'
    run_s.font.size = Pt(8.5)
    run_s.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
    pBrd = parse_xml(f'<w:pBrd {nsdecls("w")}><w:left w:val="single" w:sz="24" w:space="12" w:color="2563EB"/></w:pBrd>')
    p_struct._p.get_or_add_pPr().append(pBrd)

    # ─── 9. GITHUB REPOSITORY LINK ───
    add_section_header("9", "GitHub Repository Link")
    p_git = doc.add_paragraph()
    p_git.add_run("Accessible GitHub Repository: ").bold = True
    r_gurl = p_git.add_run("https://github.com/yuvraj2singh/ScholarShield\n")
    r_gurl.font.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)
    r_gurl.underline = True

    p_git.add_run("Feature Branch: ").bold = True
    r_burl = p_git.add_run("https://github.com/yuvraj2singh/ScholarShield/tree/node_backend_features\n")
    r_burl.font.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)
    r_burl.underline = True
    p_git.add_run("Branch contains the standalone Node.js Express engine, comprehensive documentation, and test artifacts.")

    # ─── 10. DEPLOYED PROJECT LINK ───
    add_section_header("10", "Deployed Project Link")
    p_dep = doc.add_paragraph()
    p_dep.add_run("Live Web Deployment: ").bold = True
    r_durl = p_dep.add_run("https://scholarguard.vercel.app\n")
    r_durl.font.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)
    r_durl.underline = True

    p_dep.add_run("Local Development Instances: ").bold = True
    p_dep.add_run("Frontend: http://localhost:3001 | Backend Engines: http://localhost:8000 (Python FastAPI / Node.js Express)")

    # ─── 11. TEAM MEMBER CONTRIBUTION ───
    add_section_header("11", "Team Member Contribution")
    contrib_table = doc.add_table(rows=1, cols=3)
    contrib_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    chdr = contrib_table.rows[0].cells
    chdr[0].width = Inches(1.8)
    chdr[1].width = Inches(1.8)
    chdr[2].width = Inches(3.2)
    chdr[0].paragraphs[0].add_run("Team Member").bold = True
    chdr[1].paragraphs[0].add_run("Primary Role").bold = True
    chdr[2].paragraphs[0].add_run("Key Technical Contributions").bold = True
    for c in chdr:
        set_cell_background(c, "1E3A8A")
        c.paragraphs[0].runs[0].font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
        set_cell_margins(c, 100, 100, 120, 120)

    contrib_data = [
        ("Himanshu Kumar", "Full-Stack & Systems Engineer",
         "• Architected and developed the standalone Node.js Express forensic engine (server.js) with 1:1 behavioral parity to Python.\n"
         "• Configured local MongoDB single-node Replica Set (rs0) to ensure full Prisma ORM transaction compliance.\n"
         "• Executed Prisma schema pushes, index configurations, and initial database seeding.\n"
         "• Authored comprehensive architectural documentation, PROJECT_SUMMARY.md, and formal DOCX academic reports.\n"
         "• Performed automated end-to-end integration and API verification across all routes."),
        ("Yuvraj Singh", "Lead Full-Stack Developer",
         "• Designed core frontend user experience and clearinghouse cyber design system with Tailwind CSS and Next.js 14 App Router.\n"
         "• Built interactive user routes (/scanner, /threats, /report, /registry, /verify, /admin).\n"
         "• Created the initial Python FastAPI forensic microservice (main.py) with WHOIS resolution and BeautifulSoup web scraping.\n"
         "• Defined Prisma data models and MongoDB schema specifications.\n"
         "• Implemented NextAuth.js JWT credential authentication and analyst session guards.")
    ]
    for mem, role, contrib in contrib_data:
        row = contrib_table.add_row().cells
        row[0].width = Inches(1.8)
        row[1].width = Inches(1.8)
        row[2].width = Inches(3.2)
        row[0].paragraphs[0].add_run(mem).bold = True
        row[1].paragraphs[0].add_run(role)
        row[2].paragraphs[0].add_run(contrib)
        for idx, c in enumerate(row):
            set_cell_background(c, "F8FAFC" if idx % 2 == 0 else "FFFFFF")
            set_cell_margins(c, 80, 80, 100, 100)

    # ─── 12. CONCLUSION ───
    add_section_header("12", "Conclusion & Key Learnings")
    doc.add_paragraph(
        "The ScholarShield platform demonstrates how modern full-stack web engineering, forensic automation, "
        "and proactive cybersecurity design can effectively dismantle deceptive academic exploitation networks. "
        "By fusing multi-pillar lexical analysis, registrar WHOIS querying, and IRS 501(c)(3) cross-referencing, "
        "the application establishes an accessible, production-ready defense line for prospective college students."
    )
    doc.add_paragraph("Key Technical Learnings Achieved:").bold = True
    learnings = [
        ("App Router Architecture: ", "Mastery of Server Components for rapid initial payload delivery and selective Client Components for dynamic user state."),
        ("Polyglot Microservice Integration: ", "Successfully architected seamless interoperability between Next.js serverless functions and external analysis sidecars in both Python (FastAPI) and Node.js (Express) with automatic fallback handling."),
        ("Transactional NoSQL Engineering: ", "Configured MongoDB replica sets for Prisma transactional consistency, handling ObjectId mapping, indexing, and migration pipelines."),
        ("Automated Cyber Forensics: ", "Gained deep practical expertise in homoglyph attack detection, lexical pressure pattern recognition, and live WHOIS domain telemetry.")
    ]
    for l_title, l_desc in learnings:
        bp = doc.add_paragraph(style='List Bullet')
        bp.paragraph_format.space_after = Pt(4)
        r_bt = bp.add_run(l_title)
        r_bt.bold = True
        r_bt.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)
        bp.add_run(l_desc)

    doc.save(output_path)
    print(f"✅ Successfully generated DOCX at: {output_path}")

if __name__ == "__main__":
    out_file = "/Users/himanshukumar/Study/Collage/Semester 5/ScholarFraud/ScholarShield/ScholarShield_Project_Report.docx"
    screens_dir = "/Users/himanshukumar/Study/Collage/Semester 5/ScholarFraud/ScholarShield/public/screenshots"
    create_report(out_file, screens_dir)
