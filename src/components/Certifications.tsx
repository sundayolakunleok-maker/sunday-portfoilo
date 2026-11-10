import { Award, GraduationCap, CheckCircle2, ExternalLink } from 'lucide-react';
import { certifications, profile } from '../data';

export default function Certifications() {
  return (
    <section id="certifications" className="container px-6 mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Award className="h-4 w-4" />
            Verified Qualifications
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Academic Degree & Professional Certifications
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            Formally validated credentials spanning quantitative statistics, Python automation, data modeling, and procurement systems.
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Education Highlight Card */}
        <div className="lg:col-span-3 rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50/60 via-white to-slate-50 p-6 sm:p-8 dark:border-blue-900/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 shrink-0">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Bachelor of Technology Degree
                </span>
                <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  B.Tech in Statistics
                </h3>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Ladoke Akintola University of Technology (LAUTECH), Ogbomoso, Nigeria
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Quantitative Foundations</span>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl">
            Rigorous academic foundation in probability theory, multivariate regression analysis, hypothesis testing, exploratory data analysis, time-series forecasting, and mathematical optimization that underpins all commercial dashboard and predictive model development.
          </p>
        </div>

        {/* Certifications Cards */}
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-emerald-500 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <Award className="h-5 w-5" />
                </div>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {cert.year}
                </span>
              </div>

              <h4 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 transition-colors">
                {cert.title}
              </h4>

              <p className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {cert.issuer}
              </p>

              <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {cert.description}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                Verified Credential
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
