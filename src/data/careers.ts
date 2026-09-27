/**
 * Editorial careers content.
 *
 * Job postings, filter vocabularies and application handling now come from the
 * GEAT HRIS API (see src/api/). What remains here is content the API has no
 * concept of: the career-field narratives, the FAQ, and the offer list used
 * when a posting carries no benefits text of its own.
 */

export const GEAT_OFFERS: string[] = [
  "A permanent role within a leading Algerian energy and industrial company",
  "Structured onboarding and continuous technical training programs",
  "International exposure through turbine technology partnerships",
  "Competitive compensation, health coverage and transport allowance",
  "Clear internal mobility and career progression paths",
  "A safety-first workplace with modern manufacturing facilities",
];

export type CareerField = {
  slug: string;
  title: string;
  desc: string;
  icon: string;
  /** Departments (from job data) that belong to this field */
  departments: string[];
  intro: string;
  body: string[];
  whatYouDo: string[];
  lookingFor: string[];
};

export const careerFields: CareerField[] = [
  {
    slug: "engineering-technology",
    title: "Engineering & Technology",
    desc: "Solve real-world problems and power innovation through end-to-end turbine engineering solutions.",
    icon: "Cog",
    departments: ["Production Turbines", "TG/TV"],
    intro:
      "From design reviews to root-cause analysis, our engineers keep Algeria's gas and steam turbines running at their best.",
    body: [
      "Engineering & Technology at GEAT covers mechanical, electrical, controls and methods engineering for gas turbines, steam turbines and auxiliary systems. Our teams work on real machines, in a real plant, with immediate impact on the national grid.",
      "You will work alongside experienced specialists and OEM partners, using modern design, simulation and inspection tools to solve problems no textbook has solved yet.",
    ],
    whatYouDo: [
      "Design, review and validate turbine components and auxiliary systems",
      "Lead technical investigations and root-cause analyses on returned parts",
      "Define repair methods, work instructions and acceptance criteria",
      "Support production and field teams with day-to-day technical decisions",
    ],
    lookingFor: [
      "Engineering degree in mechanical, electrical, materials or industrial engineering",
      "Curiosity, rigour and a hands-on approach to problem solving",
      "Comfort working in French and English in a multicultural environment",
    ],
  },
  {
    slug: "manufacturing-logistics",
    title: "Manufacturing & Logistics",
    desc: "Drive quality and efficiency by building products and optimising production workflows in Batna.",
    icon: "Factory",
    departments: ["Production Grid", "Production Turbines", "Production Mark6", "Logistics"],
    intro:
      "Our 200,000 m² Batna complex is where turbine components are machined, repaired, assembled and tested.",
    body: [
      "Manufacturing & Logistics teams own the shop floor: machining, welding, coating, assembly, testing and the flow of material that makes it all possible.",
      "It is a fast, physical, precise environment where Lean thinking and safety come first, and where improvements you make are visible the same week.",
    ],
    whatYouDo: [
      "Plan and supervise production activities across assembly and repair lines",
      "Drive throughput, first-pass yield and on-time delivery",
      "Apply Lean and continuous-improvement methods on the shop floor",
      "Guarantee EHS compliance in every operation",
    ],
    lookingFor: [
      "Engineering or technical degree in manufacturing, mechanics or industrial management",
      "Experience with heavy equipment, machining or assembly environments",
      "Team leadership and a strong safety mindset",
    ],
  },
  {
    slug: "quality",
    title: "Quality",
    desc: "Ensure product excellence through process improvement, standards and risk reduction.",
    icon: "ShieldCheck",
    departments: ["Quality"],
    intro:
      "Quality at GEAT means every component leaving Batna is safe, compliant and ready to run for thousands of hours.",
    body: [
      "Our Quality teams define standards, control processes and inspect parts across the full manufacturing and repair cycle — dimensional control, NDT, metallurgy, supplier quality and customer quality.",
      "You will be the guardian of technical integrity, working closely with engineering, production and sourcing to prevent defects rather than detect them.",
    ],
    whatYouDo: [
      "Perform and supervise inspections, NDT and dimensional controls",
      "Own non-conformity management, 8D and corrective action plans",
      "Audit processes and suppliers against GEAT and OEM standards",
      "Analyse quality data to drive process capability and risk reduction",
    ],
    lookingFor: [
      "Degree in mechanical, materials or quality engineering",
      "Knowledge of ISO 9001, APQP, NDT methods or metallurgy",
      "Attention to detail and the confidence to say no when standards are not met",
    ],
  },
  {
    slug: "project-management",
    title: "Project Management",
    desc: "Lead complex industrial projects with a focus on delivery, organisation and customer success.",
    icon: "ClipboardList",
    departments: ["Production Grid", "Production Turbines", "Production Mark6"],
    intro:
      "Turbine overhauls, plant outages and industrial programmes — delivered on time, on budget, on spec.",
    body: [
      "Project managers at GEAT coordinate engineering, production, sourcing and field teams around a single plan and a single customer commitment.",
      "You own scope, planning, cost and risk, and you are the voice of the customer inside the plant.",
    ],
    whatYouDo: [
      "Build and drive project schedules, budgets and risk registers",
      "Coordinate cross-functional teams and external partners",
      "Report progress and manage the customer relationship",
      "Capture lessons learned and improve the way we deliver",
    ],
    lookingFor: [
      "Engineering or business degree with industrial project exposure",
      "Planning tools and contract awareness; PMP is a plus",
      "Clear communication and calm under pressure",
    ],
  },
  {
    slug: "field-services",
    title: "Field Services",
    desc: "Support on-site performance and reliability, from commissioning to outages on Algerian power plants.",
    icon: "Wrench",
    departments: ["TG/TV", "Production Turbines"],
    intro: "Where the machines run. Field Services keeps Algeria's power plants available and reliable.",
    body: [
      "Our field teams travel to power plants across Algeria for inspections, planned outages, troubleshooting and commissioning of gas and steam turbines.",
      "It is demanding work with real responsibility — and unmatched technical learning on the largest rotating machines in the country.",
    ],
    whatYouDo: [
      "Execute inspections, overhauls and commissioning on customer sites",
      "Troubleshoot mechanical, electrical and control issues under time pressure",
      "Apply strict safety, lock-out and permit-to-work procedures",
      "Report findings and feed them back to engineering and repair teams",
    ],
    lookingFor: [
      "Technical or engineering degree in mechanics, electricity or controls",
      "Willingness to travel and work in outage schedules",
      "Autonomy, discipline and a safety-first attitude",
    ],
  },
  {
    slug: "sourcing-supply-chain",
    title: "Sourcing & Supply Chain",
    desc: "Play a critical role in how we source materials, manage suppliers and move components.",
    icon: "Truck",
    departments: ["Procurement", "Logistics"],
    intro: "Nothing gets built without the right part, at the right place, at the right time.",
    body: [
      "Sourcing & Supply Chain covers procurement, supplier development, logistics, customs, planning and inventory for a highly technical bill of materials.",
      "You negotiate, you plan, and you keep a complex industrial flow moving in an international environment.",
    ],
    whatYouDo: [
      "Source and qualify suppliers for machined parts, raw material and services",
      "Negotiate cost, lead time and contractual terms",
      "Plan material flows, inventory and import operations",
      "Track supplier performance on quality, delivery and cost",
    ],
    lookingFor: [
      "Degree in supply chain, engineering or business",
      "ERP literacy and strong negotiation skills",
      "Fluency in French and English",
    ],
  },
  {
    slug: "finance-administration",
    title: "Finance & Administration",
    desc: "Steer treasury, taxation, controlling and reporting for a growing industrial company.",
    icon: "Landmark",
    departments: ["Finance", "HR", "Legal"],
    intro: "The teams that keep GEAT financially strong, compliant and well governed.",
    body: [
      "Finance, HR and administration functions support every part of the business — from controlling and treasury to payroll, talent and legal compliance.",
      "You get industrial complexity, international reporting standards and a direct line to decision makers.",
    ],
    whatYouDo: [
      "Run controlling, reporting, treasury and tax activities",
      "Support budgeting, forecasting and investment analysis",
      "Manage recruitment, training and employee relations",
      "Ensure compliance with Algerian regulation and internal controls",
    ],
    lookingFor: [
      "Degree in finance, accounting, HR or law",
      "Analytical mindset and rigorous documentation habits",
      "Discretion and strong interpersonal skills",
    ],
  },
  {
    slug: "digital-technology-it",
    title: "Digital Technology & IT",
    desc: "Build secure systems and tools that support smarter, more efficient industrial operations.",
    icon: "Monitor",
    departments: ["IT"],
    intro: "Digitalising an industrial complex — from the network cabinet to the data dashboard.",
    body: [
      "Our IT and digital teams run the infrastructure, cybersecurity, ERP and data platforms that keep the plant connected and protected.",
      "You will work close to operations, turning shop-floor data into decisions.",
    ],
    whatYouDo: [
      "Operate and secure network, servers and industrial IT systems",
      "Support and improve ERP and business applications",
      "Build reporting and data tools for operations",
      "Drive cybersecurity awareness and compliance",
    ],
    lookingFor: [
      "Degree in computer science, networks or information systems",
      "Interest in industrial environments and OT/IT convergence",
      "Service orientation and problem-solving skills",
    ],
  },
];

export const getCareerField = (slug: string) => careerFields.find((f) => f.slug === slug);


export const careersFaqs = [
  {
    q: "How can I join GEAT?",
    a: "All our openings are published on this Careers portal. Browse the open jobs, select the position that matches your profile and apply online with your CV. If nothing fits today, send us a spontaneous application and our recruiters will contact you when a matching role opens.",
  },
  {
    q: "Do I have to register to apply?",
    a: "No account is required. You apply directly through the online form attached to each position — you only provide your details, your CV and, if you wish, a short cover letter.",
  },
  {
    q: "Can I apply for more than one job at a time?",
    a: "Yes. You may apply to every opening that matches your experience and ambitions. We recommend focusing on two or three positions and tailoring your CV to each of them.",
  },
  {
    q: "Which documents do I need to submit?",
    a: "An up-to-date CV in PDF or Word format (max 5 MB) is mandatory. Diplomas, certifications and a cover letter are optional but appreciated, and may be requested later in the process.",
  },
  {
    q: "I've applied, but I'm still waiting to hear back. What should I do?",
    a: "Our recruiters review every application, which can take up to three weeks for technical roles. You can follow your file at any time using the reference number shown when you submit your application, through Check Application Status.",
  },
  {
    q: "Can I receive a personal update on my application status?",
    a: "Yes. Use Check Application Status with your reference number and email address to see exactly where your application stands in the recruitment process.",
  },
];

/**
 * Career field -> API department keys (GET /api/meta/departments).
 *
 * The field pages are editorial groupings that predate the API, so the match is
 * not one-to-one. Exact matches: quality -> qualite, sourcing-supply-chain ->
 * sourcing, digital-technology-it -> it, finance-administration -> finance/rh/
 * juridique. The rest are judgement calls, because the old labels ("Production
 * Turbines", "TG/TV", "Production Mark6") have no API counterpart — adjust them
 * with the HR team rather than guessing further.
 */
export const careerFieldDepartments: Record<string, string[]> = {
  "engineering-technology": ["production", "mecanique", "electrotechnique", "electricite"],
  "manufacturing-logistics": ["production", "grid", "planification"],
  quality: ["qualite"],
  "project-management": ["project_mgmt", "production"],
  "field-services": ["maintenance", "repair"],
  "sourcing-supply-chain": ["sourcing"],
  "finance-administration": ["finance", "rh", "juridique"],
  "digital-technology-it": ["it"],
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
