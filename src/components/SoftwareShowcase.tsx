import { useState } from 'react';
import { 
  Code2, 
  Building2, 
  GraduationCap, 
  Activity, 
  Layers, 
  CheckCircle2, 
  ExternalLink, 
  Github, 
  ZoomIn, 
  ArrowRight,
  Download
} from 'lucide-react';
import { softwareApplications, type SoftwareApplication } from '../data';
import ProjectModal from './ProjectModal';
import ImageLightbox from './ImageLightbox';

export default function SoftwareShowcase() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'business' | 'school' | 'healthcare'>('all');
  const [selectedApp, setSelectedApp] = useState<SoftwareApplication | null>(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState<{ url: string; caption: string; title: string } | null>(null);

  const filteredApps = activeCategory === 'all' 
    ? softwareApplications 
    : softwareApplications.filter(app => app.category === activeCategory);

  const categoryCounts = {
    all: softwareApplications.length,
    business: softwareApplications.filter(a => a.category === 'business').length,
    school: softwareApplications.filter(a => a.category === 'school').length,
    healthcare: softwareApplications.filter(a => a.category === 'healthcare').length,
  };

  return (
    <section id="software" className="container px-6 mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            <Code2 className="h-4 w-4" />
            Full-Stack Systems & Enterprise Platforms
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Software Applications & Systems Development
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            Custom software architectures built for industrial manufacturing, educational administration, and clinical healthcare operations.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => setActiveCategory('all')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            All Systems ({categoryCounts.all})
          </button>
          <button
            onClick={() => setActiveCategory('business')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'business'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Building2 className="h-3.5 w-3.5 text-blue-600" />
            Business & Company ({categoryCounts.business})
          </button>
          <button
            onClick={() => setActiveCategory('school')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'school'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
            School Management ({categoryCounts.school})
          </button>
          <button
            onClick={() => setActiveCategory('healthcare')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeCategory === 'healthcare'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-red-600" />
            Healthcare & Hospital ({categoryCounts.healthcare})
          </button>
        </div>
      </div>

      {/* Applications Grid - Clean 2x2 Balanced Layout */}
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
        {filteredApps.map((app) => (
          <article
            key={app.id}
            id={app.id}
            className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:border-indigo-500 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500"
          >
            {/* Screenshot Header with Aspect Ratio & Zoom */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
              <img
                src={app.primaryImage}
                alt={app.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Category Pill */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="rounded-full bg-slate-900/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {app.categoryLabel}
                </span>
                <span className="rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-md">
                  {app.statusBadge}
                </span>
              </div>

              {/* Quick Zoom Button */}
              <button
                onClick={() => setActiveLightboxImage({
                  url: app.primaryImage,
                  caption: app.gallery[0]?.caption || app.title,
                  title: app.title
                })}
                className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-600"
                aria-label="Enlarge interface screenshot"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            {/* Card Content */}
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                {app.client}
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors">
                {app.title}
              </h3>

              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {app.description}
              </p>

              {/* Top Key Features preview */}
              <div className="mt-4 space-y-1.5">
                {app.features.slice(0, 2).map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Technologies */}
              <div className="mt-5 flex flex-wrap gap-1.5">
                {app.technologies.slice(0, 4).map((tech, i) => (
                  <span
                    key={i}
                    className="rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {tech}
                  </span>
                ))}
                {app.technologies.length > 4 && (
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    +{app.technologies.length - 4}
                  </span>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-auto pt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => setSelectedApp(app)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400 transition cursor-pointer"
                >
                  System Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  {app.codeFile && (
                    <a
                      href={app.codeFile}
                      download
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 transition"
                      title="Download Python Source Code"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Code (app.py)
                    </a>
                  )}

                  {app.githubUrl && (
                    <a
                      href={app.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl bg-slate-900 p-2 text-xs font-semibold text-white hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 transition"
                      title="GitHub Profile"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <ProjectModal
          isOpen={selectedApp !== null}
          onClose={() => setSelectedApp(null)}
          project={selectedApp}
          type="software"
        />
      )}

      {/* Lightbox Preview */}
      {activeLightboxImage && (
        <ImageLightbox
          isOpen={activeLightboxImage !== null}
          onClose={() => setActiveLightboxImage(null)}
          imageUrl={activeLightboxImage.url}
          caption={activeLightboxImage.caption}
          title={activeLightboxImage.title}
        />
      )}
    </section>
  );
}
