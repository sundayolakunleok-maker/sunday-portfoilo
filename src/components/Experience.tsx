import { motion } from 'motion/react';
import { Briefcase } from 'lucide-react';

export default function Experience() {
  const experiences = [
    {
      company: "Poolot Institute",
      role: "Data Analyst Lecturer",
      period: "2026 - Present",
      type: "Part Time",
      responsibilities: [
        "Collaborated with colleagues to develop interdisciplinary lesson plans fostering critical thinking.",
        "Developed and implemented curriculum materials enhancing the overall educational experience.",
        "Improved student comprehension through varied teaching strategies."
      ]
    },
    {
      company: "Herikare Limited",
      role: "Data Analyst / Business Analyst",
      period: "2025 - Present",
      type: "Remote",
      responsibilities: [
        "Analyzed operational and performance data to support decision-making and reporting.",
        "Prepared clear reports and presentations for non-technical stakeholders.",
        "Supported training and capacity-building through data insights."
      ]
    },
    {
      company: "SULTAN IPLIK NAZLI BASAR",
      role: "Business Analyst and Customer Services",
      period: "2024 - 2025",
      type: "Remote",
      responsibilities: [
        "Translating business need into technical or operational solutions.",
        "Monitoring performance through KPI, reports, and dashboards.",
        "Building strong customer relationships and trust."
      ]
    },
    {
       company: "HENIZ FOOD LIMITED",
       role: "Data Entry Specialist",
       period: "2023 - 2024",
       type: "Freelance",
       responsibilities: [
         "Creating dashboards and reports to track KPI and business performance.",
         "Collaborating with stakeholders through virtual meetings.",
         "Automating reports to improve efficiency and reduce manual work."
       ]
    }
  ];

  return (
    <section id="experience" className="container px-6 mx-auto scroll-mt-20">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">PROFESSIONAL EXPERIENCE</h2>
      
      <div className="mt-12 relative border-l border-slate-200 dark:border-slate-800 ml-3 md:ml-6">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            whileInView={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.1 }}
            className="mb-12 last:mb-0 pl-8 md:pl-12"
          >
            <div className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-950">
              <Briefcase className="h-3 w-3 text-white" />
            </div>
            
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{exp.role}</h3>
              <span className="inline-block rounded-md bg-slate-100 px-2 py-1 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {exp.period}
              </span>
            </div>
            
            <p className="mt-1 font-medium text-blue-600 dark:text-blue-400">
              {exp.company} <span className="text-slate-400 mx-2">|</span> {exp.type}
            </p>
            
            <ul className="mt-4 list-disc space-y-2 text-slate-600 dark:text-slate-400 pl-4">
              {exp.responsibilities.map((res, i) => (
                <li key={i}>{res}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
