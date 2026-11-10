import { GraduationCap, ArrowRight, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { academicCourses } from '../courseData';

interface ProgramPortfolioProps {
  onNavigateToCourse?: () => void;
}

export default function ProgramPortfolio({ onNavigateToCourse }: ProgramPortfolioProps) {
  return (
    <section id="academic" className="container px-6 mx-auto scroll-mt-20">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            <GraduationCap className="h-4 w-4" />
            Academic Coursework & Program Portfolio
          </div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Program Portfolio
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            Formal graduate coursework, applied software development, and technical deliverables documenting continuous mastery in advanced computing and analytics.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-1 lg:grid-cols-1">
        {academicCourses.map((course) => (
          <div
            key={course.code}
            className="group relative overflow-hidden rounded-3xl border border-blue-200/80 bg-gradient-to-br from-white via-blue-50/20 to-slate-50 p-8 shadow-sm transition-all duration-300 hover:border-blue-500 hover:shadow-xl dark:border-blue-900/40 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-950"
          >
            {/* Top decorative accent */}
            <div className="absolute top-0 right-0 h-40 w-40 rounded-bl-full bg-blue-500/10 blur-2xl transition-all group-hover:scale-125 dark:bg-blue-400/10" />

            <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-3xl space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-sm font-bold tracking-wide text-white shadow-sm shadow-blue-500/30">
                    {course.code}
                  </span>
                  <span className="rounded-xl bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    ● {course.status}
                  </span>
                  {course.term && (
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {course.term}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                  {course.code} – {course.title}
                </h3>

                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                  "{course.description}"
                </p>

                {/* Topics covered */}
                <div className="pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Key Competencies & Focus Areas:
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {course.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-white/80 px-2.5 py-1 text-xs font-medium text-slate-700 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300"
                      >
                        <CheckCircle2 className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action button */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <a
                  href="/mit-624"
                  onClick={(e) => {
                    if (onNavigateToCourse) {
                      e.preventDefault();
                      onNavigateToCourse();
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-blue-600/40 active:scale-95 dark:shadow-blue-900/40"
                >
                  <BookOpen className="h-5 w-5" />
                  View MIT 624 Course Portfolio
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
