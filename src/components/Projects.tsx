import { useState } from 'react';
import { 
  ExternalLink, 
  BookOpen, 
  Layers, 
  BarChart2, 
  TrendingUp, 
  ArrowRight,
  ZoomIn
} from 'lucide-react';
import { analyticsProjects, type AnalyticsProject } from '../data';
import ProjectModal from './ProjectModal';
import ImageLightbox from './ImageLightbox';

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<AnalyticsProject | null>(null);
  const [activeLightboxImage, setActiveLightboxImage] = useState<{ url: string; caption: string; title: string } | null>(null);

  return (
    <section id="projects" className="container px-6 mx-auto scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            <BarChart2 className="h-4 w-4" />
            Verified Case Studies & Dashboards
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Data Analytics Projects
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            End-to-end business intelligence dashboards, commercial data modeling, and automated KPI analytics across FMCG, Banking, Healthcare, and Logistics.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {analyticsProjects.map((project, index) => (
          <article
            key={project.id}
            id={project.id}
            className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:border-blue-500 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500"
          >
            {/* Screenshot Header with Hover Zoom & Quick Lightbox */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
              <img
                src={project.primaryImage}
                alt={project.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Category Pill */}
              <div className="absolute top-3 left-3">
                <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md dark:bg-slate-950/90">
                  {project.typeOfWork}
                </span>
              </div>

              {/* Quick Zoom Button */}
              <button
                onClick={() => setActiveLightboxImage({
                  url: project.primaryImage,
                  caption: project.gallery[0]?.caption || project.title,
                  title: project.title
                })}
                className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
                aria-label="Enlarge screenshot"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
            </div>

            {/* Card Content */}
            <div className="flex flex-1 flex-col p-6 sm:p-7">
              {/* Client & Tools */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                <span>{project.client}</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">Project 0{index + 1}</span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
                {project.title}
              </h3>

              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {project.problem}
              </p>

              {/* Tools Tags */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tools.slice(0, 3).map((tool, i) => (
                  <span
                    key={i}
                    className="rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {tool}
                  </span>
                ))}
                {project.tools.length > 3 && (
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    +{project.tools.length - 3}
                  </span>
                )}
              </div>

              {/* Key Metric Highlight */}
              {project.keyMetrics[0] && (
                <div className="mt-5 rounded-xl bg-blue-50/60 p-3 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30">
                  <p className="text-[11px] uppercase tracking-wider font-bold text-blue-700 dark:text-blue-300">
                    {project.keyMetrics[0].label}
                  </p>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {project.keyMetrics[0].value}
                  </p>
                </div>
              )}

              {/* Actions Footer */}
              <div className="mt-auto pt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400 transition cursor-pointer"
                >
                  View Details
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <a
                  href={project.mediumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 transition shadow-2xs"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Read on Medium
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectModal
          isOpen={selectedProject !== null}
          onClose={() => setSelectedProject(null)}
          project={selectedProject}
          type="analytics"
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
