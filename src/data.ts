export interface GalleryItem {
  url: string;
  caption: string;
}

export interface MetricItem {
  label: string;
  value: string;
}

export interface AnalyticsProject {
  id: string;
  title: string;
  shortTitle: string;
  client: string;
  typeOfWork: string;
  tools: string[];
  mediumUrl: string;
  githubUrl: string;
  primaryImage: string;
  gallery: GalleryItem[];
  problem: string;
  objectives: string[];
  methodology: string;
  findings: string;
  keyMetrics: MetricItem[];
}

export interface SoftwareApplication {
  id: string;
  category: 'business' | 'school' | 'healthcare';
  categoryLabel: string;
  title: string;
  shortTitle: string;
  client: string;
  technologies: string[];
  primaryImage: string;
  gallery: GalleryItem[];
  description: string;
  problem: string;
  features: string[];
  codeFile?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  statusBadge: string;
}

export const profile = {
  name: "SUNDAY OKEGBEMI",
  title: "Professional Data Analyst & Software Engineer",
  tagline: "Transforming Complex Data into Actionable Business Intelligence & Production-Grade Software Systems",
  bio: "I am Sunday Okegbemi, a results-driven Data Analyst, Business Intelligence Specialist, and Software Developer with over 5 years of experience transforming complex organizational data into actionable strategic insights across FMCG, Banking, E-Commerce, Logistics & Procurement, Healthcare, and Education. I specialize in turning raw data into clear reports, dynamic dashboards, and building full-stack software management systems (ERP, School Portals, Clinical Systems) that empower leadership to make confident, data-driven decisions.",
  photoUrl: "/sunday-okegbemi.jpg",
  email: "sundayolakunleok@gmail.com",
  whatsapp: "+2347035672890",
  linkedin: "https://www.linkedin.com/in/okegbemi-sunday-578b0975",
  github: "https://github.com/sundayolakunleok-maker",
  mediumProfile: "https://medium.com/@olakunkeh89",
  location: "Nigeria • Available for Remote & Global Roles",
  experienceYears: "5+ Years Experience",
  degree: "B.Tech in Statistics — LAUTECH"
};

export const analyticsProjects: AnalyticsProject[] = [
  {
    id: "sales-dashboard",
    title: "Sales Performance & Regional Revenue Dashboard",
    shortTitle: "Sales Dashboard",
    client: "Farme Structure Limited",
    typeOfWork: "Sales Intelligence & Regional Analytics",
    tools: ["Microsoft Excel", "Power BI", "Data Modeling", "ETL Cleaning", "DAX Formulas"],
    mediumUrl: "https://medium.com/@olakunkeh89/project1-74b40f720309",
    githubUrl: "https://github.com/sundayolakunleok-maker",
    primaryImage: "/screenshots/sales-dashboard-farme.png",
    gallery: [
      {
        url: "/screenshots/sales-dashboard-farme.png",
        caption: "Farme Structure Limited Executive Sales Dashboard: Revenue (₦9,320), Total Orders (12), Total Quantity (25), Category Share & Daily Trajectory"
      },
      {
        url: "/screenshots/sales-profit-heinz.png",
        caption: "Multi-parameter drilldown across product categories, salesperson filters, and geographical sales territories"
      }
    ],
    problem: "Sales leadership at Farme Structure Limited faced opacity in tracking individual salesperson contributions, incomplete territory reports, formatting inconsistencies in raw transaction sheets, and zero visibility into high-margin category share.",
    objectives: [
      "Reconstruct and clean fragmented transaction tables by removing non-numeric symbols, trailing spaces, and corrupted dates.",
      "Calculate essential commercial KPIs: Gross Revenue, Total Order Count, Total Quantity Sold, and Average Revenue per Rep.",
      "Visualize category revenue distribution across Electronics (72%), Furniture (18%), and Office Supplies (10%).",
      "Deploy interactive slicers by Salesperson (David, John, Mary, Sarah), Product Line (Chair, Desk, Laptop, Phone, Printer), and Region (East, North, South, West)."
    ],
    methodology: "Executed end-to-end ETL in Excel and Power BI, constructed relational dimension tables linking sales reps, products, and regional channels, and engineered an executive high-contrast dashboard with dynamic time-series tracking.",
    findings: "Uncovered that Electronics generated 72% of total revenue despite lower volume, while Office Supplies underperformed at 10%. Regional analysis revealed the North and East territories as top growth vectors, prompting management to optimize sales staff deployment.",
    keyMetrics: [
      { label: "Total Revenue Tracked", value: "₦9,320" },
      { label: "Electronics Share", value: "72%" },
      { label: "Sales Territories", value: "4 Regions" },
      { label: "Reporting Speed", value: "Real-time" }
    ]
  },
  {
    id: "sales-profit-analysis",
    title: "Sales & Profit Margin Optimization Dashboard",
    shortTitle: "Sales & Profit Analysis",
    client: "Heinz / Delink Group of Companies",
    typeOfWork: "Financial Analytics & Profit Margin Auditing",
    tools: ["Microsoft Excel", "Power BI", "Financial Modeling", "Pivot Analytics"],
    mediumUrl: "https://medium.com/@olakunkeh89/project-2-271b48a80c57",
    githubUrl: "https://github.com/sundayolakunleok-maker",
    primaryImage: "/screenshots/sales-profit-heinz.png",
    gallery: [
      {
        url: "/screenshots/sales-profit-heinz.png",
        caption: "Heinz Sales & Profit Dashboard: Total Sales (₦1,928,887.86), Total Profit (₦247,961.07), Year-over-Year Trajectory & Top Customers"
      },
      {
        url: "/screenshots/sales-dashboard-farme.png",
        caption: "Delink Group Sales & Profit Analysis: Gross Sales $41,346.96, Total Profit $7,056.96 with 11.62% Net Profit Margin"
      }
    ],
    problem: "Enterprise financial analysts struggled with missing product cost structures, inability to audit net profit margins per stock item, and lack of customer-level profitability metrics across a 4-year historical dataset.",
    objectives: [
      "Build a centralized product master table incorporating standard costs, realized sale prices, and profit margins.",
      "Analyze historical performance across 2021, 2022, 2023, and 2024 to discover multi-year profit trajectories.",
      "Isolate top profit-generating customers and rank customer contributions (Top 5: Tamara, Adrian, Sanjit, Bill, Daniel).",
      "Deliver geographic profit drilldown across Nigerian states and product categories (Furniture, Office Supplies, Technology)."
    ],
    methodology: "Standardized raw commercial sheets across 4 fiscal years, resolved numeric type mismatches, developed automated margin formulas, and built an interactive dashboard combining dual-axis charts with category slicers.",
    findings: "Successfully audited ₦1,928,887.86 in gross revenue generating ₦247,961.07 in net profit. Technology items (Phones & Copiers) yielded the highest absolute profit (₦39.77K in 2023), whereas high-volume items like Fasteners contributed less than 1% profit, driving SKU price adjustments.",
    keyMetrics: [
      { label: "Gross Sales Audited", value: "₦1,928,887.86" },
      { label: "Net Profit Analyzed", value: "₦247,961.07" },
      { label: "Years Analyzed", value: "2021 – 2024" },
      { label: "Top Customer Margin", value: "₦8,764.95" }
    ]
  },
  {
    id: "category-performance",
    title: "B2B Sales Pipeline & Category Conversion Funnel",
    shortTitle: "Category Performance Dashboard",
    client: "Enterprise B2B Technology & Services",
    typeOfWork: "Commercial Intelligence & Funnel Optimization",
    tools: ["Power BI", "SQL", "DAX", "Data Modeling", "Funnel Analytics"],
    mediumUrl: "https://medium.com/@olakunkeh89/project-3-5643630d3e43",
    githubUrl: "https://github.com/sundayolakunleok-maker",
    primaryImage: "/screenshots/category-performance-pipeline.png",
    gallery: [
      {
        url: "/screenshots/category-performance-pipeline.png",
        caption: "B2B Category Performance & Sales Funnel: $931K Closed Deal Value, 348 Deals, 3,000 Leads, Churn Analysis & Agent Leaderboard"
      }
    ],
    problem: "Enterprise sales leadership experienced severe drop-offs across pipeline stages. Out of 3,000 incoming leads, customer conversion was only 11.6%, churn was rising (177 accounts lost), and deal closure velocity varied unpredictably by industry.",
    objectives: [
      "Model the complete progression funnel: New (3,000) → Qualified (2,487) → Sales Accepted (1,743) → Opportunity (1,215) → Customer (348).",
      "Quantify key executive metrics: Closed Deal Value ($931K), Closed Deals (348), Average Deal Value ($2,676), and Average Close Cycle (63 Days).",
      "Segment closed volume across enterprise size (Medium, Small, Micro, Large) and industry sectors (Transportation, Banking, IT, Healthcare).",
      "Evaluate individual sales agent output and geographical concentration across European and North American markets."
    ],
    methodology: "Extracted CRM lead records, applied SQL data shaping to model state transitions, engineered DAX stage progression measures, and built an interactive visual pipeline dashboard with granular cross-filtering.",
    findings: "Discovered an 11.6% overall conversion rate with mid-market accounts (201-500 employees) generating the highest deal concentration (138 deals). Transportation & Logistics represented the top revenue industry vertical (68 closed deals), providing actionable targeting priorities.",
    keyMetrics: [
      { label: "Closed Deal Value", value: "$931,000" },
      { label: "Leads Audited", value: "3,000" },
      { label: "Conversion Rate", value: "11.6%" },
      { label: "Avg Sales Cycle", value: "63 Days" }
    ]
  },
  {
    id: "hospital-feedback-automation",
    title: "Healthcare Patient Feedback Automation & Clinical Service QA",
    shortTitle: "Hospital Feedback Automation",
    client: "Clinical Healthcare Facility",
    typeOfWork: "Clinical Operations & Patient Experience Analytics",
    tools: ["Python", "Microsoft Excel", "Automation Scripts", "Statistical Analysis"],
    mediumUrl: "https://medium.com/@olakunkeh89/project-4-665f3bae62d2",
    githubUrl: "https://github.com/sundayolakunleok-maker",
    primaryImage: "/screenshots/hospital-feedback-form.png",
    gallery: [
      {
        url: "/screenshots/hospital-feedback-form.png",
        caption: "Standardized Digital Patient Feedback Capture Interface: In-Patient/Out-Patient Categorization & Department Routing"
      }
    ],
    problem: "Hospital management struggled with manual, paper-based patient satisfaction feedback. Critical complaints regarding administrative bottlenecks and nursing delays went unaddressed for weeks, leading to declining patient retention.",
    objectives: [
      "Eliminate paper forms by building a streamlined digital feedback capture interface.",
      "Categorize feedback seamlessly across In-Patients and Out-Patients and hospital departments (Administration, Nursing, Medical, Pharmacy).",
      "Automate real-time complaint logging, severity indexing, and immediate notification dispatch.",
      "Generate executive QA dashboards highlighting departmental strengths vs. recurring service weaknesses."
    ],
    methodology: "Engineered an intuitive form interface capturing patient metadata, encounter type, department, and service evaluations. Configured Python automation scripts to parse submissions, populate a centralized audit spreadsheet, and trigger service alerts.",
    findings: "Reduced feedback aggregation time from 14 days to real time. Analysis revealed that 68% of administrative dissatisfaction stemmed from billing wait times rather than medical care quality, enabling targeted front-desk workflow restructuring.",
    keyMetrics: [
      { label: "Processing Latency", value: "< 1 Minute" },
      { label: "Departmental Coverage", value: "100%" },
      { label: "Patient Classification", value: "IPD & OPD" },
      { label: "QA Reporting Cycle", value: "Weekly Automated" }
    ]
  },
  {
    id: "logistics-tracking",
    title: "Logistics Route Optimization & Delivery Performance System",
    shortTitle: "Logistics Tracking System",
    client: "Freight & Commercial Supply Chain Operations",
    typeOfWork: "Supply Chain & Fleet Intelligence",
    tools: ["Python", "SQL", "Power BI", "Predictive Analytics"],
    mediumUrl: "https://medium.com/@olakunkeh89/project-5-ffdd51f1ed3b",
    githubUrl: "https://github.com/sundayolakunleok-maker",
    primaryImage: "/screenshots/logistics-tracking.jpg",
    gallery: [
      {
        url: "/screenshots/logistics-tracking.jpg",
        caption: "Logistics Tracking System Dashboard: Fleet Dispatch, Fuel Efficiency, Delivery Lead Times & Warehouse KPIs"
      }
    ],
    problem: "Commercial logistics teams struggled with spiraling fuel expenditures, unmonitored delivery driver idle times, lack of shipment visibility, and escalating customer delivery complaints across transit corridors.",
    objectives: [
      "Consolidate dispatch records, GPS transit timestamps, and fuel logs into a unified relational database.",
      "Model key operational KPIs: on-time delivery rate (OTD), route fuel consumption, turnaround duration, and delivery cost per unit.",
      "Detect distribution bottlenecks between regional warehouses and customer drop-off centers.",
      "Provide logistics managers with interactive tracking dashboards for proactive route adjustment."
    ],
    methodology: "Built Python data processing pipelines to clean multi-source logistics sensor and invoice data, utilized SQL for trip-level aggregation, and crafted an executive Power BI tracking suite featuring route performance heatmaps and cost variance metrics.",
    findings: "Identified route redundancy patterns and excess idling that accounted for 18% of fleet fuel waste. Implemented revised transit scheduling that improved on-time delivery from 74% to 91% while cutting customer service escalations by 42%.",
    keyMetrics: [
      { label: "On-Time Delivery", value: "91% (from 74%)" },
      { label: "Fuel Waste Reduction", value: "18%" },
      { label: "Customer Escalations", value: "-42%" },
      { label: "Fleet Visibility", value: "Real-time" }
    ]
  }
];

export const softwareApplications: SoftwareApplication[] = [
  {
    id: "manufacturing-erp",
    category: "business",
    categoryLabel: "Business & Company Applications",
    title: "Manufacturing Production Management System (Mfg ERP Suite)",
    shortTitle: "Mfg ERP Production Suite",
    client: "Industrial Manufacturing & Production Plants",
    technologies: ["Python", "Flask", "SQLite", "OpenPyXL", "HTML5/Tailwind", "RESTful API"],
    primaryImage: "/screenshots/manufacturing-erp.png",
    gallery: [
      {
        url: "/screenshots/manufacturing-erp.png",
        caption: "Mfg ERP Production Suite Executive Dashboard: Production Orders, Machine Master, Raw Materials, Inventory, Suppliers, and Expenses Tracking"
      }
    ],
    description: "Enterprise-grade manufacturing execution system built with Python, Flask, and SQLite. Features an executive analytics dashboard, production order lifecycle management, machine master registry, raw materials inventory, purchase orders, quality control (QC), departmental expense auditing, and automated Excel reporting.",
    problem: "Factory supervisors struggled with manual paper work-orders, uncoordinated machine scheduling leading to unplanned downtime, inventory stockouts during critical shifts, and delayed cost accounting.",
    features: [
      "Production Order Management: PO ID, Batch No, Planned vs. Actual Quantity, Machine & Operator Assignment, Status lifecycle (Pending, In Progress, Completed)",
      "Machine Master Registry: Machine name, location, daily capacity, active status, last/next scheduled maintenance dates",
      "Raw Materials & Inventory Auditing: Transaction logging (IN/OUT), reorder level triggers, and automated material issuance",
      "Supplier & Purchase PO Tracking: Vendor database, payment terms, unit pricing, and delivery verification",
      "Quality Control (QC) Suite: Inspection scheduling, inspector logs, defect categorization, and batch pass/defect ratios",
      "Departmental Expense Ledger: Category, amount, payment method, vendor, and multi-tier administrative approval",
      "Automated Excel Export: Powered by OpenPyXL with executive Navy/Blue alternating styling and auto-adjusted columns",
      "Database Backup Engine: Instant point-in-time SQLite backups with administrative management"
    ],
    codeFile: "/code/manufacturing_erp_app.py",
    githubUrl: "https://github.com/sundayolakunleok-maker",
    statusBadge: "Production Ready"
  },
  {
    id: "ecommerce-finance",
    category: "business",
    categoryLabel: "Business & Company Applications",
    title: "E-Commerce Financial Accountability & Cash Flow Monitoring System",
    shortTitle: "E-Commerce Finance Monitoring",
    client: "Digital Commerce & Multi-Channel Retailers",
    technologies: ["Python", "SQL", "Power BI", "Data Analytics", "Financial Modeling"],
    primaryImage: "/screenshots/ecommerce-finance-monitoring.png",
    gallery: [
      {
        url: "/screenshots/ecommerce-finance-monitoring.png",
        caption: "E-Commerce Finance Monitoring Suite: Total Income (₦825,119) vs Total Expense (₦859,749), Net Savings & Budget Used (429.9%)"
      }
    ],
    description: "High-integrity financial monitoring platform that tracks multi-channel digital sales, operational expenditures, vendor payouts, and cash-flow variances in real time with anomaly alerts for budget overruns.",
    problem: "E-commerce merchants faced transaction reconciliation gaps, unmonitored advertising spend overruns (budget used hitting 429.9%), negative net savings, and lack of automated audit-ready financial statements.",
    features: [
      "Real-time Income (₦825,119) vs. Expense (₦859,749) reconciliation engine",
      "Budget threshold anomaly detection alerting leadership to operational overruns",
      "Time-series cash flow trajectory visualizing daily spikes and seasonal liquidity",
      "Multi-level approval workflows for audit teams and finance directors",
      "One-click CSV data export and executive PDF financial report generation"
    ],
    githubUrl: "https://github.com/sundayolakunleok-maker",
    statusBadge: "Active System"
  },
  {
    id: "adunola-school-system",
    category: "school",
    categoryLabel: "School Management Applications",
    title: "Central School Management System (Offline-Ready Education Portal)",
    shortTitle: "Central School Management System",
    client: "Adunola Standard College, Ogbomoso, Oyo State",
    technologies: ["Web Technologies", "Local Storage Database", "Offline PWA Architecture", "Role-Based Auth"],
    primaryImage: "/screenshots/adunola-school-system.png",
    gallery: [
      {
        url: "/screenshots/adunola-school-system.png",
        caption: "Adunola Standard College Central School Management Portal: 100% Offline Ready with Local Storage Database & Secure Staff Authentication"
      }
    ],
    description: "Comprehensive school management portal engineered with a 100% offline-ready local storage database architecture. Empowers educators to administer student admissions, staff records, term-by-term academic results, and CBT examinations without requiring constant internet access.",
    problem: "Schools operating in emerging markets frequently face electrical outages and unreliable broadband. Cloud-only portals left teachers unable to enter test scores, verify student fees, or run examinations during network outages.",
    features: [
      "100% Offline-Ready Architecture with automatic local storage database synchronization",
      "Role-Based Access Control (Super Administrator, Head of School, Subject Teachers, Exam Officers)",
      "Student Academic Records: Class rosters, biodata, continuous assessment (CA) scores, and attendance",
      "Automated Academic Result Processing: Termly report card generation, grade calculation, and position ranking",
      "CBT Examination System: Computer-based test administration with automated score grading",
      "Session-Based Archiving: Seamless switching between terms (2025/2026 Academic Session - First Term)"
    ],
    githubUrl: "https://github.com/sundayolakunleok-maker",
    statusBadge: "Deployed & Operational"
  },
  {
    id: "hospital-management-erp",
    category: "healthcare",
    categoryLabel: "Healthcare & Hospital Applications",
    title: "Multi-Portal Hospital Management & Clinical Operations ERP",
    shortTitle: "Hospital Management ERP",
    client: "Clinical Healthcare Facilities & Multi-Specialty Centers",
    technologies: ["Python", "Flask", "SQLite", "OpenPyXL", "Multi-Portal Auth", "RESTful API"],
    primaryImage: "/screenshots/hospital-management-erp.png",
    gallery: [
      {
        url: "/screenshots/hospital-management-erp.png",
        caption: "Multi-Portal Hospital Management & Clinical Operations ERP: Centralized Clinical Workflows, OPD/IPD Admissions, Vitals, Pharmacy & Billing System"
      }
    ],
    description: "Full-scale clinical operations ERP coordinating patient care across three distinct portals: Staff/Admin Portal, Doctor Consultation Portal, and Patient Self-Service Portal. Manages appointments, electronic vitals, OPD visits, IPD ward admissions, pharmacy stock, lab diagnostics, and billing.",
    problem: "Hospitals struggled with lost paper charts, slow handoffs between nursing triage and consulting doctors, medication stockouts during emergencies, and delayed billing reconciliations.",
    features: [
      "Three Dedicated Portals: Admin/Staff Management, Doctor Consultation Suite, and Patient Portal",
      "Outpatient (OPD) & Inpatient (IPD) Admissions: Ward & bed allocation with daily fee tracking",
      "Electronic Vitals Registry: Blood pressure, pulse, temperature, weight, height, SpO2, and blood glucose",
      "Doctor Consultation Suite: Chief complaint logging, diagnostic coding, and digital prescription issuance",
      "Pharmacy Inventory & Dispensing: Unit pricing, reorder level alerts, and prescription dispensing verification",
      "Diagnostic Laboratory Testing: Order creation, reference ranges, and selective result release to patient portal",
      "Hospital Billing & Invoices: Automatic line-item generation, payments, balance tracking, and financial exports"
    ],
    codeFile: "/code/hospital_erp_app.py",
    githubUrl: "https://github.com/sundayolakunleok-maker",
    statusBadge: "Full-Stack System"
  }
];

export const certifications = [
  {
    title: "Certificate in Data Science",
    issuer: "UniAthena / Cambridge",
    year: "Verified",
    description: "Comprehensive training in statistical data analysis, machine learning foundations, exploratory data analysis, and predictive modeling."
  },
  {
    title: "Certificate in Python Programming",
    issuer: "UniAthena / Cambridge",
    year: "Verified",
    description: "Advanced Python scripting, data structures, automation routines, and data manipulation utilizing Pandas and NumPy."
  },
  {
    title: "Certificate in Essential Excel",
    issuer: "UniAthena / Cambridge",
    year: "Verified",
    description: "Advanced formulas, financial modeling, dynamic dashboard development, and multi-dimensional pivot table analysis."
  },
  {
    title: "Certificate in Procurement Management",
    issuer: "UniAthena",
    year: "Verified",
    description: "Strategic supply chain optimization, inventory replenishment methodologies, and vendor evaluation frameworks."
  },
  {
    title: "Data Labeling Job Simulation",
    issuer: "Forage",
    year: "Verified",
    description: "Practical simulation covering machine learning data annotation, classification rigor, and AI model quality assurance."
  }
];
