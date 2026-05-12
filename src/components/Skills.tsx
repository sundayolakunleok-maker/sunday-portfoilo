import { motion } from 'motion/react';
import { Database, BarChart3, LineChart, Table, Cpu, Settings } from 'lucide-react';

export default function Skills() {
  const skillsList = [
    { name: "Data Cleaning & Preparation", tools: "Excel, Python, R, MySQL, SPSS, Matlab", icon: Settings },
    { name: "Data Visualization", tools: "Excel, Power BI, Python, SPSS, Matlab", icon: BarChart3 },
    { name: "Exploratory Data Analysis", tools: "Excel, Python, R", icon: LineChart },
    { name: "Dashboard & Reporting", tools: "Excel, Power BI", icon: Table },
    { name: "SQL Queries for Insights", tools: "SQL (MySQL, PostgreSQL)", icon: Database },
    { name: "Statistical Modeling", tools: "Regression, Time series, Matlab", icon: Cpu }
  ];

  return (
    <section id="skills" className="container px-6 mx-auto scroll-mt-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">SKILLS & TOOLS</h2>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Advanced proficiency in industry-leading analytical tools and languages.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillsList.map((skill, index) => (
          <motion.div
            key={index}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: index * 0.1 }}
            className="group rounded-2xl border border-slate-100 bg-white p-6 transition-all hover:border-blue-500 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-900/30">
              <skill.icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold dark:text-white">{skill.name}</h3>
            <p className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400">Advanced Proficiency</p>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tools:</span>
              <br />
              {skill.tools}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
