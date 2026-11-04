# Content inventory: `main` → rebuild

Generated from `index.html` at commit `08106d3` (main, 2026-11-04). Every row is
marked **migrate** (carry over exactly), **rewrite** (same facts, new copy or
structure) or **drop** (does not survive the rebuild). Links and numbers marked
migrate are checked by the data-integrity tests in `tests/`.

## Summary

| Area | Items on `main` | Plan |
|---|---|---|
| Certificate links (6 specialization or certificate pages, 53 courses) | 59 URLs | migrate exactly into `src/content/certifications/` and `courses/` |
| Project links (4 featured + 6 earlier + "all repositories") | 16 URLs | migrate exactly into `src/content/projects/`; add this repo as a project |
| Work Impact numbers | 440 / 717 / 203 / 399 (+ 256, 184, 98, 180) | migrate exactly into `src/content/impact/` with `asOf: 2026-11-04`, `source: GitLab contributions at ClinicMind` |
| Experience entries | 5 roles, 1 degree | migrate copy; QA Automation dates become Sep 2025 - May 2026 (brief), Software Engineer May 2026 - present |
| Skills | 6 groups, 18 self-rated bars | names regrouped (QA first); all percentages **drop** |
| Socials | Facebook, Instagram, GitHub, LinkedIn, YouTube, TikTok | GitHub, LinkedIn, YouTube migrate; the rest **drop** |
| Contact | phone, email, city, Google Form iframe | email migrates; phone, city and Google Form **drop**; location becomes "Philippines (remote)" |
| Photos | profile-pic, about-pic, resume-pic | migrate to `src/assets/`, served through `astro:assets` with real alt text |
| Résumé PDF | `assets/files/resume.pdf` | migrate to `public/resume.pdf` + `TODO(jumi): confirm résumé is current` |
| Favicon, apple-touch-icon | template-era PNGs | **drop**; new favicon set + manifest generated from a monogram |
| Vendor code (Bootstrap, Bootstrap Icons, AOS, Typed.js, Waypoints), `main.css`, `main.js` | all | **drop** |

## Template leftovers found on `main`

| Check | Result | Action |
|---|---|---|
| "Alexander Chen" alt text | not present | nothing to do; CI grep for `Alexander` stays as a guard |
| "Our Location"-style copy | not present | nothing to do |
| Empty or placeholder meta tags | none; `about-pic.jpg` has an empty `alt` | real alt text in the rebuild |
| Typing-effect hero | present (`data-typed-items`, Typed.js) | **drop** |
| BootstrapMade credit | footer, README, `main.css` and `main.js` headers | **drop** everywhere |
| HIPAA / HL7 / FHIR claims | one: skills tooltip "defect triage for a HIPAA-regulated product" | becomes `TODO(jumi): confirm wording` |
| "Mid-Level, 4+ years in healthcare software", "Experience Level" label | present in About | **drop** (self-rated level) |
| Languages "English, Spanish, Filipino" | present in About | English and Filipino migrate; Spanish → `TODO(jumi): confirm level` |

## Project card copy

The four featured project descriptions, highlight bullets, numbers (18 locators / 10 tests,
recall@8 100%, faithfulness 5.0/5, about $0.001 per question, 60 pytest + 44 Vitest tests,
71 unit tests, 13 eval cases, 58 API tests) and tag lists on `main` migrate as written, then
each is re-checked against the repository README before the data file is final. The six
earlier-repo blurbs migrate as written.

## 0. Head and metadata

| Item | Value on `main` | Plan |
|---|---|---|
| title | Jumilan L. Dela Peña — Full-Stack Developer & QA Automation Engineer | rewrite (same facts, new copy; OG image generated at build) |
| meta description | Engr. Jumilan L. Dela Peña (Dela Pena) — Full-Stack Developer and QA Automation Engineer at ClinicMind, licensed Electronics Engineer in Cagayan de Oro City, Philippines. 440+ merged merge requests on a healthcare EHR platform; certified by Meta, Google and IBM. | rewrite (same facts, new copy; OG image generated at build) |
| canonical | https://jumilandelapena.github.io/portfolio/ | rewrite (same facts, new copy; OG image generated at build) |
| og:title | Jumilan L. Dela Peña — Full-Stack Developer & QA Automation Engineer | rewrite (same facts, new copy; OG image generated at build) |
| og:description | Full-Stack Developer and QA Automation Engineer on a US healthcare EHR platform. Angular, Node.js, Playwright and Claude-powered tools. Meta, Google and IBM certified. | rewrite (same facts, new copy; OG image generated at build) |
| og:image | https://jumilandelapena.github.io/portfolio/assets/img/profile/profile-pic.jpg | rewrite (same facts, new copy; OG image generated at build) |
| JSON-LD jobTitle | Full-Stack Developer and QA Automation Engineer | migrate |
| JSON-LD worksFor | ClinicMind | migrate |
| JSON-LD alumniOf | University of Science and Technology of Southern Philippines | migrate |
| JSON-LD address | Cagayan de Oro City, PH | rewrite: `Philippines` only (remote positioning) |
| JSON-LD knowsAbout | Full-Stack Development, Angular, React, Node.js, Django, Test Automation, Playwright, CI/CD, AI Engineering, Electronics Engineering, Project Management, Data Analytics | migrate |
| JSON-LD sameAs | https://www.linkedin.com/in/engr-jumilan-dela-pena | migrate |
| JSON-LD sameAs | https://github.com/jumilandelapena | migrate |
| JSON-LD sameAs | https://www.facebook.com/jumidelapena | drop (socials: GitHub, LinkedIn, YouTube only) |
| JSON-LD sameAs | https://www.instagram.com/jumidelapena | drop (socials: GitHub, LinkedIn, YouTube only) |
| JSON-LD sameAs | https://www.youtube.com/@jumilandelapena | migrate |
| JSON-LD sameAs | https://www.tiktok.com/@jumilann0112 | drop (socials: GitHub, LinkedIn, YouTube only) |

## 1. Section `#hero`

Plan: rewrite: no typing effect; headline chosen by Jumi; CTAs Projects + Résumé; status panel added

Headings:

- h1: Hi! I'm Jumi
- h2: Engr. Jumilan L. Dela Peña

| Link text | href | Plan |
|---|---|---|
| View My Work | #projects | rewrite (new anchor id if section renamed) |
| Get In Touch | #contact | rewrite (new anchor id if section renamed) |
| (icon) | https://www.facebook.com/jumidelapena | drop |
| (icon) | https://www.instagram.com/jumidelapena | drop |
| (icon) | https://github.com/jumilandelapena | migrate |
| (icon) | https://www.linkedin.com/in/engr-jumilan-dela-pena | migrate |
| (icon) | https://www.youtube.com/@jumilandelapena | migrate |
| (icon) | https://www.tiktok.com/@jumilann0112 | drop |

| Image | alt on `main` | Plan |
|---|---|---|
| assets/img/profile/profile-pic.jpg | Engr. Jumilan L. Dela Peña | migrate to src/assets via astro:assets, real alt text |

## 2. Section `#about`

Plan: rewrite shorter (first person, EE-to-software path in 2-3 sentences); facts migrate

Headings:

- h3: Engr. Jumilan Dela Peña
- h2: Building and Testing Healthcare Software, From Circuit Boards to Cloud Apps

| Link text | href | Plan |
|---|---|---|
| jumilandelapenaece@gmail.com | mailto:jumilandelapenaece@gmail.com | migrate |
| +63 961 459 1904 | tel:+639614591904 | drop |
| Download Resume | assets/files/resume.pdf | migrate + TODO(jumi): confirm résumé is current |
| Let's Talk | #contact | rewrite (new anchor id if section renamed) |

| Image | alt on `main` | Plan |
|---|---|---|
| assets/img/profile/about-pic.jpg | (empty) | migrate to src/assets via astro:assets, real alt text |

## 3. Section `#skills`

Plan: rewrite: percentages dropped, names regrouped (QA first); tooltips become plain descriptions

Headings:

- h2: Skills
- h3: Full-Stack Development
- h4: TypeScript, Angular & React
- h4: Node.js, Python & Django
- h4: REST APIs, MongoDB & SQL
- h3: Test Automation & CI/CD
- h4: Playwright End-to-End Testing
- h4: CI/CD: GitLab CI, GitHub Actions & Jenkins
- h4: Unit, Storybook & Visual Regression Testing
- h3: AI Engineering
- h4: Prompt Engineering & LLM Integration
- h4: RAG, Citations & AI Agents
- h4: AI-Assisted Development Workflow
- h3: Electronics Engineering
- h4: Circuit Design & Analysis
- h4: Microcontrollers & Embedded Systems
- h4: PCB Design
- h3: Project Management
- h4: Agile & Scrum
- h4: Stakeholder Management
- h4: Risk & Quality Management
- h3: Data Analytics & Digital Marketing
- h4: SQL & Data Visualization
- h4: R Programming & Statistical Analysis
- h4: SEO, Marketing Analytics & CRM

Self-rated percentage bars: 18 - **drop** (names kept).

## 4. Section `#resume`

Plan: migrate copy into Experience timeline + Certifications data; percentage bars dropped

Headings:

- h2: Resume
- h3: Professional Summary
- h3: Contact Information
- h3: Technical Skills
- h3: Professional Experience
- h4: Software Engineer (Full-Stack)
- h5: May 2026 - Present
- h4: QA Automation Engineer
- h5: Sep 2025 - Present
- h4: Help System Designer
- h5: 2022 - 2025
- h4: Project Engineer
- h5: 2021 - 2022
- h4: Content Engineer Intern
- h5: 2018
- h3: Education
- h4: Bachelor of Science in Electronics Engineering
- h5: 2014 - 2019
- h3: Certifications
- h4: Meta Full Stack Developer: Front-End & Back-End from Scratch Specialization
- h5: 2026
- h4: Playwright, CI/CD for Test Automation, AI Agents in TypeScript and Prompt Engineering (Coursera)
- h5: 2026
- h4: Google AI Prompting Essentials Specialization
- h5: 2025
- h4: IBM Full-Stack Software Developer Professional Certificate
- h5: 2025
- h4: Google Digital Marketing & E-commerce Professional Certificate
- h5: 2025
- h4: Google Data Analytics Professional Certificate
- h5: 2024
- h4: Google Project Management Professional Certificate
- h5: 2024

| Link text | href | Plan |
|---|---|---|
| linkedin.com/in/engr-jumilan-dela-pena | https://www.linkedin.com/in/engr-jumilan-dela-pena | migrate |
| github.com/jumilandelapena | https://github.com/jumilandelapena | migrate |

| Image | alt on `main` | Plan |
|---|---|---|
| assets/img/profile/resume-pic.jpg | Engr. Jumilan L. Dela Peña, resume photo | migrate to src/assets via astro:assets, real alt text |

Self-rated percentage bars: 5 - **drop** (names kept).

Bullet copy (migrate as experience / impact highlights; HIPAA, HL7 or FHIR wording becomes `TODO(jumi): confirm wording`):

- Ship features and bug fixes across the Angular front end and the Node.js back end of a US electronic health record (EHR) product: 256 merged merge requests in six months, 98 of them in October 2026 alone.
- Built the Help Center guided-walkthrough engine, the Page Guides admin editor, the Knowledge Check dashboard with manager tools and review queues, Practice Settings search, and email-code sign-in for public appointment booking.
- Hardened patient-facing and clinical workflows (CareConnect portal, telehealth, scheduling, care plans, billing, mailboxes): closed cross-practice data leaks, timezone and daylight-saving bugs, hung server-sent-event routes and failed-startup blank screens.
- Deliver every change with proof: hermetic Playwright end-to-end specs, Storybook stories, unit tests and visual baselines, plus 141 bug and improvement reports from exploratory testing of the platform.
- Own a large share of the 1,000+ test Playwright suite that gates every release of the EHR across four environments: 184 merged merge requests and 460+ commits.
- Designed and built the ChiroNote clinical-note suite from scratch in 40+ increments: SuperNote-to-ChiroNote data salting, vitals, neurological and musculoskeletal exams, assessment and plan, sign-off and chart-widget sync.
- Migrated chart components, field and macro manipulation, spine diagram, problem list and care-plan specs to the new Angular front end, and refactored the suite onto shared fixtures and page objects.
- Kept nightly pipelines green: diagnosed CI timeouts, date-boundary and hydration races, iframe and locator drift, and version-gated specs across releases v50 to v56.
- Reported 200+ product and test-suite defects with reproducible steps, from data-integrity bugs to narrative rendering and accessibility issues.
- Produced tutorial videos and articles to facilitate user understanding of software functionality.
- Authored comprehensive manuals, providing step-by-step instructions for software usage.
- Generated update notifications to inform users about new software releases and features.
- Provided responsive user support, addressing inquiries and concerns promptly and effectively.
- Managed business operations, overseeing day-to-day activities and strategic planning.
- Provided exceptional customer support via email, addressing inquiries and resolving concerns promptly.
- Developed detailed PCB instructions for manufacturing, ensuring accuracy and quality control.
- Generated quotations for materials required in PCB production, optimizing cost-efficiency.
- Created web content, optimizing for SEO and increasing site traffic.
- Designed PCBs for electronic products, ensuring functionality and compliance.
- Conducted QA testing, identifying defects and improving product reliability.

## 5. Section `#achievements`

Plan: migrate exactly (numbers, dates, highlights); add as-of date + source in data file

Headings:

- h2: Work Impact at ClinicMind
- h3: Software Engineer, Vangular EHR platform
- h3: QA Automation Engineer, Playwright smoke-test suite

| Number | Label | Note | Plan |
|---|---|---|---|
| 440 | merge requests merged | 256 in the EHR platform, 184 in the test suite | migrate exactly |
| 717 | commits on main | 98 merge requests landed in October 2026 alone | migrate exactly |
| 203 | issues reported | 180 already resolved by the team | migrate exactly |
| 399 | assigned tickets closed | bug fixes, QA verification and features | migrate exactly |

Bullet copy (migrate as experience / impact highlights; HIPAA, HL7 or FHIR wording becomes `TODO(jumi): confirm wording`):

- Help Center and guided walkthroughs. Built the walkthrough engine on CDK overlays (spotlight, step cards, skip versus complete), the Page Guides admin editor with live-page anchor picking, per-user progress and funnel events, and the "Ask AI" feedback loop.
- Knowledge Checks for staff training. Managers, manager groups, weekly and overdue summaries delivered as tasks, a question review queue, and learning paths that assign their knowledge-check steps.
- Practice Settings and configuration. Advanced settings grid read and save on the Node.js back end with rollout flags, a pinned "Find a setting" search, and chip overflow handling.
- Patient-facing flows. Email-code sign-in and paperwork steps for public appointment booking, CareConnect portal draft preservation and message threading, telehealth fixes, and portal access-link error messages.
- Security and data integrity. Owner emails after lock-outs, passkey and cookie scoping on dev hosts, PHI audit logging for dashboards and AI Scribe, and fixes for cross-practice chart and mailbox leaks.
- Reliability. Server-sent-event routes that no longer hang the pod on a throw, a reload page instead of a blank app on failed startup, deferred migrations that finish every step, and a run of timezone and daylight-saving corrections.
- Care plans and scheduling. Twenty-plus fixes in two months: visit patterns, templates, attendance and billing alignment, slot widths, drag-and-drop flicker and placeholder cards.
- Engineering tooling. Merge-request readiness evidence, Storybook screenshot checks, pre-merge periodic spec runs, startup-pin checks and lint coverage for tools and tests.
- ChiroNote test suite, built from zero. Forty-plus merge requests covering SuperNote-to-ChiroNote salting for vitals, cranial nerves, nerve-root assessment, balance, vestibular and cognitive exams, posture, subluxation, every spinal and extremity region, manual muscle testing, assessment and plan, hard sign-off, chart-widget sync and appointment-type section logic.
- Migration to the new Angular front end. Converted chart components (nine parts), the XDirect chart widget, field and macro manipulation (sixteen parts), spine diagram, problem list, presenting-problems link-back, sticky notes and care-plan specs.
- Suite architecture. Introduced shared fixtures for opening notes and loading macros, section-expansion helpers and parameterised page-object locators, then applied them across regression, care-plan and configuration specs.
- Pipeline health across four environments. Fixed CI timeouts, nightly date-boundary failures, hydration and dead-click races, iframe selector drift, and version-gated specs for releases v50 to v56 (and removed the gates once releases rolled out).
- Defect discovery. Over 200 issues filed, including duplicate patient account numbers, narrative data that failed to salt or render, linkback navigation bugs, telehealth session problems and Help Center editor defects.
- Release coverage inside the platform repo. Hermetic smoke coverage for ChiroNote validations, formulary and medication administration, fax-on-completion and schedule visuals, plus an auth bootstrap that isolates one rejected login from the rest of the run.

## 6. Section `#projects`

Plan: migrate exactly (links, descriptions, highlights, tags); add this portfolio repo; filters added

Headings:

- h2: Projects
- h3: Self-Healing Playwright Test Agent
- h3: Chat with your PDFs (RAG with citations)
- h3: AI Code Review GitHub Action
- h3: Little Lemon Restaurant API
- h3: More on GitHub

| Link text | href | Plan |
|---|---|---|
| Code | https://github.com/jumilandelapena/selfheal-playwright | migrate |
| Self-Healing Playwright Test Agent | https://github.com/jumilandelapena/selfheal-playwright | migrate |
| Code | https://github.com/jumilandelapena/pdf-chat-rag | migrate |
| Chat with your PDFs (RAG with citations) | https://github.com/jumilandelapena/pdf-chat-rag | migrate |
| Code | https://github.com/jumilandelapena/ai-code-review-action | migrate |
| Demo PR | https://github.com/jumilandelapena/ai-code-review-action/pull/1 | migrate |
| AI Code Review GitHub Action | https://github.com/jumilandelapena/ai-code-review-action | migrate |
| Code | https://github.com/jumilandelapena/little-lemon-api | migrate |
| Little Lemon Restaurant API | https://github.com/jumilandelapena/little-lemon-api | migrate |
| sta School website for Santa Teresita Academy, Inc. (Aurora, Zamboanga del Sur) built with React 19, Vite 6 and Tailwind CSS v4, with all copy and photos editable from one data file. | https://github.com/jumilandelapena/sta | migrate |
| CI-CD-for-Test-Automation-JenkinsGitHub-Actions Playwright test project wired into Jenkins and GitHub Actions pipelines, from the CI/CD for Test Automation course. | https://github.com/jumilandelapena/CI-CD-for-Test-Automation-JenkinsGitHub-Actions | migrate |
| xrwvm-fullstack_developer_capstone IBM Full-Stack capstone: a car dealership review application with a Django back end, React front end and a Node.js and MongoDB microservice, containerised for the cloud. | https://github.com/jumilandelapena/xrwvm-fullstack_developer_capstone | migrate |
| e-plantShopping React and Redux plant shop with product listing, cart state and checkout flow, from the IBM React course. | https://github.com/jumilandelapena/e-plantShopping | migrate |
| expressBookReviews Node.js and Express book review server with JWT session authentication and async/await API calls, from the IBM back-end course. | https://github.com/jumilandelapena/expressBookReviews | migrate |
| portfolio This site: a static, accessible single page on Bootstrap 5, served from GitHub Pages. | https://github.com/jumilandelapena/portfolio | migrate |
| All repositories on GitHub | https://github.com/jumilandelapena?tab=repositories | migrate |

## 7. Section `#certificates`

Plan: migrate exactly (every specialization and course URL); becomes data + filters

Headings:

- h2: Professional Certifications
- h3: Meta Full Stack Developer: Front-End & Back-End from Scratch Specialization
- h4: Specialization Courses:
- h3: Test Automation, CI/CD & AI Engineering Courses
- h4: Course Certificates:
- h3: Google AI Prompting Essentials Specialization
- h4: Specialization Courses:
- h3: IBM Full-Stack Software Developer Professional Certificate
- h4: Certificate Courses:
- h3: Google Digital Marketing & E-commerce Professional Certificate
- h4: Certificate Courses:
- h3: Google Data Analytics Professional Certificate
- h4: Certificate Courses:
- h3: Google Project Management Professional Certificate
- h4: Certificate Courses:

| Link text | href | Plan |
|---|---|---|
| Meta Full Stack Developer: Front-End & Back-End from Scratch Specialization | https://www.coursera.org/account/accomplishments/specialization/IO4ZLIRCI22B | migrate |
| Introduction to Front-End Development | https://www.coursera.org/account/accomplishments/verify/2HHYHWK4O65C | migrate |
| Version Control | https://www.coursera.org/account/accomplishments/verify/CJH7WHAH5LTF | migrate |
| HTML and CSS in depth | https://www.coursera.org/account/accomplishments/verify/1DIZ97XYI7AJ | migrate |
| React Basics | https://www.coursera.org/account/accomplishments/verify/9MKT03BM08LL | migrate |
| Advanced React | https://www.coursera.org/account/accomplishments/verify/6FN4S1FNFDN6 | migrate |
| Programming in Python | https://www.coursera.org/account/accomplishments/verify/M9RKGD5IQTE8 | migrate |
| Introduction to Databases for Back-End Development | https://www.coursera.org/account/accomplishments/verify/7NDX6Z4F34PZ | migrate |
| Django Web Framework | https://www.coursera.org/account/accomplishments/verify/WEZH1CLQBA4A | migrate |
| APIs | https://www.coursera.org/account/accomplishments/verify/W4GWG8OVW754 | migrate |
| Playwright Power Techniques: Fast and Reliable Web Testing | https://www.coursera.org/account/accomplishments/verify/V77NBOTF9AS4 | migrate |
| CI/CD for Test Automation: Jenkins & GitHub Actions | https://www.coursera.org/account/accomplishments/verify/RGEIG0JMR0FV | migrate |
| AI Agents in TypeScript/JavaScript with Generative AI | https://www.coursera.org/account/accomplishments/verify/GXNQYFWYO2YV | migrate |
| Prompt Engineering for ChatGPT | https://www.coursera.org/account/accomplishments/verify/F00XAXU84CU3 | migrate |
| Google AI Prompting Essentials Specialization | https://www.coursera.org/account/accomplishments/specialization/certificate/YEMZ592TB04B | migrate |
| Start Writing Prompts like a Pro | https://www.coursera.org/account/accomplishments/certificate/8OW7XLUDN1GO | migrate |
| Design Prompts for Everyday Work Tasks | https://www.coursera.org/account/accomplishments/certificate/LT5MEOLKXFKQ | migrate |
| Speed Up Data Analysis and Presentation Building | https://www.coursera.org/account/accomplishments/certificate/7U7UK5ARIDTJ | migrate |
| Use AI as a Creative or Expert Partner | https://www.coursera.org/account/accomplishments/certificate/X515DEDXU0LK | migrate |
| IBM Full-Stack Software Developer Professional Certificate | https://www.coursera.org/account/accomplishments/specialization/certificate/J09ZZZ5JCE4U | migrate |
| Introduction to Software Engineering | https://www.coursera.org/account/accomplishments/certificate/3WW84UOB28PG | migrate |
| Introduction to Cloud Computing | https://www.coursera.org/account/accomplishments/certificate/KDUMSK1LN56C | migrate |
| Introduction to HTML, CSS, & JavaScript | https://www.coursera.org/account/accomplishments/certificate/QWGE8JK19YY7 | migrate |
| Getting Started with Git and GitHub | https://www.coursera.org/account/accomplishments/certificate/6HUZV3O7G2GU | migrate |
| Developing Front-End Apps with React | https://www.coursera.org/account/accomplishments/certificate/R5R2XJ320UVB | migrate |
| Developing Back-End Apps with Node.js and Express | https://www.coursera.org/account/accomplishments/certificate/8J83LTJLL4BN | migrate |
| Python for Data Science, AI & Development | https://www.coursera.org/account/accomplishments/certificate/E08IMYM5LS1T | migrate |
| Developing AI Applications with Python and Flask | https://www.coursera.org/account/accomplishments/certificate/M60EKDRSI9SE | migrate |
| Django Application Development with SQL and Databases | https://www.coursera.org/account/accomplishments/certificate/AIFCEJER5G80 | migrate |
| Introduction to Containers w/ Docker, Kubernetes & OpenShift | https://www.coursera.org/account/accomplishments/certificate/J8L8Z4K1J194 | migrate |
| Application Development using Microservices and Serverless | https://www.coursera.org/account/accomplishments/certificate/D1QRN82FOP8G | migrate |
| Full Stack Application Development Capstone Project | https://www.coursera.org/account/accomplishments/certificate/A9M1HXS0XNDU | migrate |
| Full Stack Software Developer Assessment | https://www.coursera.org/account/accomplishments/certificate/4Z975F6LS5AN | migrate |
| Generative AI: Elevate your Software Development Career | https://www.coursera.org/account/accomplishments/certificate/62R3DY1LAQIF | migrate |
| Software Developer Career Guide and Interview Preparation | https://www.coursera.org/account/accomplishments/certificate/IQ1U41G7DKAF | migrate |
| Google Digital Marketing & E-commerce Professional Certificate | https://www.coursera.org/account/accomplishments/specialization/certificate/PFE8WW08X58K | migrate |
| Foundations of Digital Marketing and E-commerce | https://www.coursera.org/account/accomplishments/certificate/DDZJK79ZQQDW | migrate |
| Attract and Engage Customers with Digital Marketing | https://www.coursera.org/account/accomplishments/certificate/9L04GBLJXPFA | migrate |
| From Likes to Leads: Interact with Customers Online | https://www.coursera.org/account/accomplishments/certificate/QAMEBSL1Z59L | migrate |
| Think Outside the Inbox: Email Marketing | https://www.coursera.org/account/accomplishments/certificate/B5ETAI7A0JP2 | migrate |
| Assess for Success: Marketing Analytics and Measurement | https://www.coursera.org/account/accomplishments/certificate/HWSYYBKSYNTR | migrate |
| Make the Sale: Build, Launch, and Manage E-commerce Stores | https://www.coursera.org/account/accomplishments/certificate/NB1NTVTA5S0M | migrate |
| Satisfaction Guaranteed: Develop Customer Loyalty Online | https://www.coursera.org/account/accomplishments/certificate/65MALDLLF5F8 | migrate |
| Google Data Analytics Professional Certificate | https://www.coursera.org/account/accomplishments/specialization/certificate/KVGQUBCI6EIF | migrate |
| Foundations: Data, Data, Everywhere | https://www.coursera.org/account/accomplishments/certificate/47DD4HNS9ZZ6 | migrate |
| Ask Questions to Make Decisions | https://www.coursera.org/account/accomplishments/certificate/P71KLO9TQZU4 | migrate |
| Prepare Data for Exploration | https://www.coursera.org/account/accomplishments/certificate/R80N1U83O8AM | migrate |
| Process Data from Dirty to Clean | https://www.coursera.org/account/accomplishments/certificate/4B9H7I1TFRDM | migrate |
| Analyze Data to Answer Questions | https://www.coursera.org/account/accomplishments/certificate/K939KBS8F6AL | migrate |
| Share Data Through the Art of Visualization | https://www.coursera.org/account/accomplishments/certificate/5Z9BCE9H9XBY | migrate |
| Data Analysis with R Programming | https://www.coursera.org/account/accomplishments/certificate/L00WODZ75RG3 | migrate |
| Google Data Analytics Capstone: Complete a Case Study | https://www.coursera.org/account/accomplishments/certificate/W5LM3A8OIW2Q | migrate |
| Google Project Management Professional Certificate | https://www.coursera.org/account/accomplishments/specialization/certificate/J9ZGXR8M757A | migrate |
| Foundations of Project Management | https://www.coursera.org/account/accomplishments/certificate/HTYK99BAO94F | migrate |
| Project Initiation: Starting a Successful Project | https://www.coursera.org/account/accomplishments/certificate/FACYZCABXDY3 | migrate |
| Project Planning: Putting it All Together | https://www.coursera.org/account/accomplishments/certificate/DTQOF8CS2IUB | migrate |
| Project Execution: Running the Project | https://www.coursera.org/account/accomplishments/certificate/WHL1M2PS8JFV | migrate |
| Agile Project Management | https://www.coursera.org/account/accomplishments/certificate/6MXF6P3DPZCX | migrate |
| Capstone: Applying Project Management in the Real World | https://www.coursera.org/account/accomplishments/certificate/IMVRNRX2H1WI | migrate |

## 8. Section `#contact`

Plan: rewrite: email + LinkedIn + GitHub only; phone and Google Form dropped

Headings:

- h2: Contact
- h3: Contact Info
- h4: Location
- h4: Phone Number
- h4: Email Address

| Link text | href | Plan |
|---|---|---|
| +63 961 459 1904 | tel:+639614591904 | drop |
| jumilandelapenaece@gmail.com | mailto:jumilandelapenaece@gmail.com | migrate |

## 9. Footer

- Copy: © 2026 Engr. Jumilan L. Dela Peña. All Rights Reserved. Designed by BootstrapMade
- Plan: © line migrates; BootstrapMade credit **drops**; add source link + last-deployed date.

