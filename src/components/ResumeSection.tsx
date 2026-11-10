import { FileText, Download, Printer, CheckCircle2, Briefcase, GraduationCap, Mail, Phone, Linkedin, ExternalLink } from 'lucide-react';
import { profile } from '../data';

export default function ResumeSection() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="resume" className="container px-6 mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <FileText className="h-4 w-4" />
            Curriculum Vitae
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Resume & Professional Profile
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            Summary of qualifications, statistical background, software engineering competencies, and professional career history.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </button>
          <a
            href={`mailto:${profile.email}?subject=Request%20for%20Official%20CV%20-%20Sunday%20Okegbemi`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
          >
            <Download className="h-4 w-4" />
            Request Full CV Document
          </a>
        </div>
      </div>

      {/* Resume Card Container */}
      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-10">
        {/* Resume Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-2 border-white shadow-md ring-2 ring-blue-500/20 dark:border-slate-800 shrink-0">
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase">
                {profile.name}
              </h3>
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {profile.title}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {profile.location}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800"
            >
              <Mail className="h-3.5 w-3.5" />
              {profile.email}
            </a>
            <a
              href={`https://wa.me/${profile.whatsapp.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800"
            >
              <Phone className="h-3.5 w-3.5" />
              {profile.whatsapp}
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800"
            >
              <Linkedin className="h-3.5 w-3.5" />
              LinkedIn Profile
            </a>
          </div>
        </div>

        {/* Executive Summary */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Executive Summary
          </h4>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {profile.bio}
          </p>
        </div>

        {/* Competencies Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/50">
            <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Analytics & BI Core
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> Microsoft Excel (Advanced Modeling)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> Power BI & Interactive Dashboards</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> SQL (MySQL, PostgreSQL queries)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> Statistical Inference & SPSS/Matlab</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> ETL Cleaning & Data Pipelines</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/50">
            <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Software Engineering
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" /> Python (Flask, Pandas, NumPy)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" /> Relational Database Design (SQLite/SQL)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" /> Full-Stack Management Portals (ERP)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" /> Automated Excel Engine (OpenPyXL)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" /> Offline-first Architecture & Local DBs</li>
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/50">
            <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Domains & Industries
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> FMCG & Food Processing (Heinz)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Commercial Logistics & Freight</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Clinical Healthcare & Patient QA</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Education & School Administration</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Multi-Channel E-Commerce Finance</li>
            </ul>
          </div>
        </div>

        {/* Education & Training */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            <GraduationCap className="h-4 w-4 text-blue-600" />
            Education & Academic Credentials
          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  Bachelor of Technology (B.Tech) in Statistics
                </p>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Ladoke Akintola University of Technology (LAUTECH), Ogbomoso, Nigeria
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">Graduated</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  MIT 624 – AI-Powered Software Development
                </p>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Modernizing Enterprise Technology Estates & Autonomous AI Coding Agents
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-600">Active Term</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
